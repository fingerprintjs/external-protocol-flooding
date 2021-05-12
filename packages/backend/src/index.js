"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const defaultDatabaseUrl = 'postgres://localhost/schemeflood';
const dbPool = new pg_1.Pool({
    max: 25,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    query_timeout: 20000,
    connectionString: process.env.DATABASE_URL || defaultDatabaseUrl
});
const app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
app.get('/', (_, res) => res.send({ ok: true, msg: 'schemeflood.com backend API, nothing to do here, move on' }));
app.post('/app_hashes', async (req, res) => {
    const { visitorId, appHash } = req.body;
    if (!appHash || appHash.length === 0) {
        const err = 'appHash value is required';
        console.warn(err);
        res.status(422).send({ ok: false, error: err });
        return;
    }
    let count = 0;
    try {
        const startedTimestamp = perf_hooks_1.performance.now();
        const { rows } = await dbPool.query('SELECT COUNT(1) as count FROM app_hashes WHERE app_hash = $1', [appHash]);
        count = rows[0].count;
        await dbPool.query('INSERT INTO app_hashes (visitor_id, app_hash) VALUES ($1, $2)', [
            visitorId,
            appHash,
        ]);
        const duration = Math.round(perf_hooks_1.performance.now() - startedTimestamp);
        res.status(202).send({ ok: true, duration: `${duration}ms`, count });
    }
    catch (e) {
        console.error(e);
        res.status(422).send({ ok: false, error: 'Failed to add appHash' });
    }
});
app.use((err, _req, res, next) => {
    console.error(err);
    res.send({ ok: false, error: 'Server error, please try again' });
    next(err);
});
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.listen(port, () => {
    console.log(`schemeflood.com backend listening on port ${port}`);
});
