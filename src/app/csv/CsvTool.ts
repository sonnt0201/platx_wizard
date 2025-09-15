import { ITimeSeriesRes, ITsValuePair } from "@/models/client/DevicesManager";
import dayjs from "dayjs";

type NumberAsString = string

/**
 * Design to be compatible with (casted) MUIX's {@link GridColDef} for MUIX data grid. 
 */
interface IBasicGridColDef {
    field: string,
    headerName: string,
    [index: string]: unknown,
}

/**
 * Designed for thingsboard telemetry response format
 */
export class CsvTool {
    /** as selected keys to export  */
    private _columnHeaders: Set<string> = new Set();

    /** as timepoint *values* by milliseconds (stringified for set consistency) */
    private _rowHeaders: Set<NumberAsString> = new Set();
    private _originData: ITimeSeriesRes = {};
    private _timestep: number = 0;
    private _2dMap: {
        [rowAsTime: NumberAsString]: {
            [columnAsKey: string]: number;
        }
    } = {};

    private _invalidKeys: string[] = []

    get invalidKeys() {
        return this._invalidKeys
    }

    constructor(data: ITimeSeriesRes, keys: string[], timestep: number) {
        // validate keys
        keys.forEach(key => {
            if (data[key] === undefined) {
                console.error("key: ", key, " is not valid in data: ", data);
                this._invalidKeys.push(key)
            } else {
                this._columnHeaders.add(key)
            }
        })

        if (this._columnHeaders.size === 0) return;

        this._originData = data;
        this._timestep = timestep;

        // map each key
        Array.from(this._columnHeaders).forEach(key => {
            this._handleDataArrayOf(key);
        });

        // sort row headers
        const rowHeadersArr = [...this._rowHeaders];
        rowHeadersArr.sort();
        this._rowHeaders = new Set(rowHeadersArr);
    }

    /** format timestamp -> readable */
    private _formatReadable(ts: number | string) {
        const num = typeof ts === "string" ? Number(ts.split("_")[0]) : ts;
        return dayjs(num).format("YYYY-MM-DD HH:mm:ss");
    }

    /** Export CSV string with both timestamp + time */
    toCsvString(): string {
        let str = '';

        // add header
        const TIME_COLUMN_HEADER_TIMESTAMP = 'timestamp';
        const TIME_COLUMN_HEADER_READABLE = 'time';

        str += `${TIME_COLUMN_HEADER_TIMESTAMP},${TIME_COLUMN_HEADER_READABLE}`;
        this._columnHeaders.forEach(header => {
            str += "," + header;
        })
        str += '\n';

        // rows
        this._rowHeaders.forEach(row => {
            const readable = this._formatReadable(row);

            str += row.toString(); // timestamp
            str += "," + readable; // readable time

            this._columnHeaders.forEach(column => {
                str += "," + this._2dMap[row][column];
            })
            str += '\n';
        })

        return str;
    }

    /** Transform to DataGrid columns */
    toGridColumnsDefinition(): IBasicGridColDef[] {
        const result: IBasicGridColDef[] = [];

        // two time columns
        result.push({
            field: "timestamp",
            headerName: "Timestamp (ms)",
            editable: false,
            width: 150
        });

        result.push({
            field: "time",
            headerName: "Time",
            editable: false,
             width: 200, // 👈 extend width
        });

        this._columnHeaders.forEach(item => {
            result.push({
                field: item,
                headerName: item,
            });
        });

        return result;
    }

    /** Transform to DataGrid rows */
    toGridRowsData(): unknown[] {
        const rows: unknown[] = [];

        this._rowHeaders.forEach(timepoint => {
            const newRow: {
                [index: string]: string | number
            } = {
                id: timepoint,
                timestamp: timepoint,
                time: this._formatReadable(timepoint),
            }

            this._columnHeaders.forEach(columnLabel => {
                newRow[columnLabel] = String(this._2dMap[timepoint][columnLabel]);
            })

            rows.push(newRow)
        })

        return rows
    }

    private _handleDataArrayOf(key: string) {
        const pairs = this._originData[key] as ITsValuePair[];

        pairs.forEach(pair => {
            const startTs = pair.ts;
            let valAsArray: number[] = [];

            if (typeof pair.value === 'string') {
                try {
                    valAsArray = [JSON.parse(pair.value)];
                } catch (e) {
                    console.error(e);
                }
            } else if (typeof pair.value === 'number') {
                valAsArray = [pair.value];
            } else if (Array.isArray(pair.value)) {
                valAsArray = pair.value;
            }

            valAsArray.forEach((val, index) => {
                let time: NumberAsString;

                if (this._timestep !== 0) {
                    time = String(startTs + (index * this._timestep));
                } else {
                    time = String(startTs) + `_${index < 10 ? '000' : ''}${index}`;
                }

                if (!this._2dMap[time]) this._2dMap[time] = {};
                this._2dMap[time][key] = val;
                this._rowHeaders.add(time);
            })
        })
    }
}
