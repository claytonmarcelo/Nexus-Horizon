export interface IConnectivityProvider {
  getStatus(): Promise<string>
  getLatency(): number
  getSignalStrength(): number
  getTechnology(): string
}

export class SatelliteProvider implements IConnectivityProvider {
  constructor(private readonly satelliteId: string) {}

  async getStatus(): Promise<string> {
    return `Connected — Orbital node ${this.satelliteId}`
  }

  getLatency(): number {
    return Math.floor(Math.random() * 30) + 20
  }

  getSignalStrength(): number {
    return Math.floor(Math.random() * 20) + 80
  }

  getTechnology(): string {
    return 'Satellite'
  }
}

export class CellularProvider implements IConnectivityProvider {
  constructor(private readonly towerId: string) {}

  async getStatus(): Promise<string> {
    return `Connected — Tower ${this.towerId}`
  }

  getLatency(): number {
    return Math.floor(Math.random() * 10) + 5
  }

  getSignalStrength(): number {
    return Math.floor(Math.random() * 30) + 60
  }

  getTechnology(): string {
    return '5G'
  }
}

export class LiFiProvider implements IConnectivityProvider {
  constructor(private readonly sensorId: string) {}

  async getStatus(): Promise<string> {
    return `Connected — Li-Fi node ${this.sensorId}`
  }

  getLatency(): number {
    return 1
  }

  getSignalStrength(): number {
    return 100
  }

  getTechnology(): string {
    return 'Li-Fi'
  }
}

export class DirectToCellProvider implements IConnectivityProvider {
  constructor(private readonly nodeId: string) {}

  async getStatus(): Promise<string> {
    return `Connected — Direct-to-Cell node ${this.nodeId}`
  }

  getLatency(): number {
    return Math.floor(Math.random() * 15) + 10
  }

  getSignalStrength(): number {
    return Math.floor(Math.random() * 25) + 70
  }

  getTechnology(): string {
    return 'Direct-to-Cell'
  }
}