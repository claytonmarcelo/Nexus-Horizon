"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectToCellProvider = exports.LiFiProvider = exports.CellularProvider = exports.SatelliteProvider = void 0;
class SatelliteProvider {
    constructor(satelliteId) {
        this.satelliteId = satelliteId;
    }
    async getStatus() {
        return `Connected — Orbital node ${this.satelliteId}`;
    }
    getLatency() {
        return Math.floor(Math.random() * 30) + 20;
    }
    getSignalStrength() {
        return Math.floor(Math.random() * 20) + 80;
    }
    getTechnology() {
        return 'Satellite';
    }
}
exports.SatelliteProvider = SatelliteProvider;
class CellularProvider {
    constructor(towerId) {
        this.towerId = towerId;
    }
    async getStatus() {
        return `Connected — Tower ${this.towerId}`;
    }
    getLatency() {
        return Math.floor(Math.random() * 10) + 5;
    }
    getSignalStrength() {
        return Math.floor(Math.random() * 30) + 60;
    }
    getTechnology() {
        return '5G';
    }
}
exports.CellularProvider = CellularProvider;
class LiFiProvider {
    constructor(sensorId) {
        this.sensorId = sensorId;
    }
    async getStatus() {
        return `Connected — Li-Fi node ${this.sensorId}`;
    }
    getLatency() {
        return 1;
    }
    getSignalStrength() {
        return 100;
    }
    getTechnology() {
        return 'Li-Fi';
    }
}
exports.LiFiProvider = LiFiProvider;
class DirectToCellProvider {
    constructor(nodeId) {
        this.nodeId = nodeId;
    }
    async getStatus() {
        return `Connected — Direct-to-Cell node ${this.nodeId}`;
    }
    getLatency() {
        return Math.floor(Math.random() * 15) + 10;
    }
    getSignalStrength() {
        return Math.floor(Math.random() * 25) + 70;
    }
    getTechnology() {
        return 'Direct-to-Cell';
    }
}
exports.DirectToCellProvider = DirectToCellProvider;
//# sourceMappingURL=ConnectivityProvider.js.map