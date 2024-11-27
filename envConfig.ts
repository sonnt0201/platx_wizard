import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()


export const useEnvConfig = () => loadEnvConfig(projectDir)