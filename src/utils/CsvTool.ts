import { ITimeSeriesRes, ITsValuePair } from "@/models/client/Devices";


/*
    Designed for thingsboard telemetry response format
*/
export class CsvTool {

    private _columnHeaders: Set<string> = new Set(); // as selected keys to export 
    private _rowHeaders: Set<number> = new Set(); // as timepoints by milliseconds
    private _originData: ITimeSeriesRes = {};
    private _timestep: number = 0;
    private _2dMap: {
        [rowAsTime: number]: {
            [columnAsKey: string]: number;
        }
    } = {};


    private _valid = true;

    constructor(data: ITimeSeriesRes, keys: string[], timestep: number) {

        // check valid keys
        keys.forEach(key => {
            if (data[key] === undefined) {
                this._valid = false;

            }
        })

        if (!this._valid) return;

        // assign columnheader
        this._columnHeaders = new Set(keys);
        this._originData = data;
        this._timestep = timestep;
        // map data
        keys.map(key => {

            this._handleDataArrayOf(key);

        });

       
        // sort row headers
        const rowHeadersArr = [...this._rowHeaders];
        rowHeadersArr.sort();
        this._rowHeaders = new Set(rowHeadersArr);

        


    }


    toCsvString(): string {
        let str = '';

        // add first line as header
        const TIME_COLUMN_HEADER = 'timestamp';
        str += TIME_COLUMN_HEADER;
        this._columnHeaders.forEach(header => {
            str += "," + header;
        })
        str += '\n'; // end line

       

        // following line
        this._rowHeaders.forEach(row => {
            // first column as timestamp 
            str += row.toString();

            // following column as values of keys
            this._columnHeaders.forEach(column => {
                str += "," + this._2dMap[row][column];
            })
            // end a line
            str += '\n'; 


        })


        return str;
    }

    private _handleDataArrayOf(key: string) {


        const pairs = this._originData[key] as ITsValuePair[];

        pairs.forEach(pair => {


            const startTs = pair.ts;
            let valAsArray: number[] = []

            // calibrate type for value
            if (typeof pair.value === 'string')
                try {
                    valAsArray = JSON.parse(pair.value);
                } catch (e) {
                    console.error(e);
                    this._valid = false;
                }

            
            if (typeof pair.value === 'number') {
                valAsArray = [pair.value]
            }


            if (Array.isArray(pair.value)) valAsArray = pair.value;

            
            // separate and map with all timepoints
            valAsArray.forEach((val, index) => {
                const time = startTs + (index * this._timestep)

                if (!this._2dMap[time]) this._2dMap[time] = {};

                this._2dMap[time][key] = val;
                this._rowHeaders.add(time);
            })

        })


    }


}