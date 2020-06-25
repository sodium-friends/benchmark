
## Hashing

This benchmark compares various configurations of `crypto.createHash` from
Node.js core with `crypto_generichash`.

The winner is:

```js
const { crypto_generichash } = require('sodium-universal/crypto_generichash')

const output = Buffer.alloc(64)

// Note! This reuses the same Buffer over and over again. You only own it until
// the next call. You can either copy it (the no prealloc test does this) or
// you can turn it into whatever string format you require
// (the prealloc, digest does this). Note that these two suggestions of course
// change the performance, so review the numbers in the tables below
function hash (data) {
  crypto_generichash(output, data)
  return output
}
```

### Hardware

```
uname: Linux 4.15.0-38-generic #41-Ubuntu SMP Wed Oct 10 10:59:38 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux
Model: Hetzner EX41-SSD
CPU: Intel Core i7-6700 Quad Core
Memory: 32 GB DDR4
Disk: 2× 500 GB SSD
```

### 64 bytes

```
╔════════════════════════════════════════════════════════╤═════════╤═══════════════════╤═══════════╤═════════════════════════╗
║ Slower tests                                           │ Samples │            Result │ Tolerance │ Difference with slowest ║
╟────────────────────────────────────────────────────────┼─────────┼───────────────────┼───────────┼─────────────────────────╢
║ crypto sha256 (prealloc)                               │   10000 │  370321.25 op/sec │ ±  4.65 % │                         ║
║ crypto sha512 (prealloc)                               │    1000 │  382075.76 op/sec │ ±  0.94 % │ + 3.17 %                ║
║ crypto blake2b512 (prealloc)                           │    1000 │  401530.47 op/sec │ ±  0.98 % │ + 8.43 %                ║
║ crypto sha256 (no prealloc)                            │    1000 │  453419.74 op/sec │ ±  0.80 % │ + 22.44 %               ║
║ crypto sha512 (no prealloc)                            │    1000 │  460150.51 op/sec │ ±  0.69 % │ + 24.26 %               ║
║ crypto blake2b512 (no prealloc)                        │    1000 │  478510.57 op/sec │ ±  0.96 % │ + 29.21 %               ║
║ crypto sha256 (no prealloc, digest)                    │   10000 │  566184.79 op/sec │ ±  9.17 % │ + 52.89 %               ║
║ crypto sha512 (no prealloc, digest)                    │    1500 │  572655.25 op/sec │ ±  0.93 % │ + 54.64 %               ║
║ sodium-native generichash (state no reuse, digest)     │   10000 │  608201.51 op/sec │ ±  8.16 % │ + 64.24 %               ║
║ crypto blake2b512 (no prealloc, digest)                │    1500 │  635363.84 op/sec │ ±  0.79 % │ + 71.57 %               ║
║ sodium-native generichash (32, state no reuse, digest) │    1500 │  693007.10 op/sec │ ±  0.84 % │ + 87.14 %               ║
║ sodium-native generichash (state no reuse)             │   10000 │  726852.47 op/sec │ ±  9.45 % │ + 96.28 %               ║
║ sodium-native generichash (32, state no reuse)         │    1500 │  780502.02 op/sec │ ±  0.97 % │ + 110.76 %              ║
║ sodium-native generichash (32, no prealloc, digest)    │   10000 │  880695.68 op/sec │ ± 12.49 % │ + 137.82 %              ║
║ sodium-native generichash (no prealloc, digest)        │   10000 │  920298.64 op/sec │ ± 11.46 % │ + 148.51 %              ║
║ sodium-native generichash (state reuse, digest)        │   10000 │  995537.40 op/sec │ ± 11.67 % │ + 168.83 %              ║
║ sodium-native generichash (32, state reuse, digest)    │   10000 │ 1091170.46 op/sec │ ± 12.17 % │ + 194.66 %              ║
║ sodium-native generichash (32, no prealloc)            │   10000 │ 1279935.12 op/sec │ ± 13.74 % │ + 245.63 %              ║
║ sodium-native generichash (no prealloc)                │   10000 │ 1284029.51 op/sec │ ± 14.66 % │ + 246.73 %              ║
║ sodium-native generichash (prealloc, digest)           │    1500 │ 1326325.62 op/sec │ ±  0.99 % │ + 258.16 %              ║
║ sodium-native generichash (state reuse)                │   10000 │ 1336378.49 op/sec │ ± 15.10 % │ + 260.87 %              ║
║ sodium-native generichash (32, state reuse)            │   10000 │ 1339021.68 op/sec │ ± 15.02 % │ + 261.58 %              ║
║ sodium-native generichash (32, prealloc, digest)       │   10000 │ 1368295.10 op/sec │ ± 15.15 % │ + 269.49 %              ║
║ sodium-native generichash (32, prealloc)               │   10000 │ 1728572.91 op/sec │ ± 19.03 % │ + 366.78 %              ║
╟────────────────────────────────────────────────────────┼─────────┼───────────────────┼───────────┼─────────────────────────╢
║ Fastest test                                           │ Samples │            Result │ Tolerance │ Difference with slowest ║
╟────────────────────────────────────────────────────────┼─────────┼───────────────────┼───────────┼─────────────────────────╢
║ sodium-native generichash (prealloc)                   │   10000 │ 1753616.83 op/sec │ ± 18.99 % │ + 373.54 %              ║
╚════════════════════════════════════════════════════════╧═════════╧═══════════════════╧═══════════╧═════════════════════════╝
```

### 384 bytes

```
╔════════════════════════════════════════════════════════╤═════════╤═══════════════════╤═══════════╤═════════════════════════╗
║ Slower tests                                           │ Samples │            Result │ Tolerance │ Difference with slowest ║
╟────────────────────────────────────────────────────────┼─────────┼───────────────────┼───────────┼─────────────────────────╢
║ crypto blake2b512 (prealloc)                           │   10000 │  372311.59 op/sec │ ±  6.84 % │                         ║
║ crypto sha256 (prealloc)                               │    1500 │  374951.26 op/sec │ ±  0.80 % │ + 0.71 %                ║
║ crypto sha512 (prealloc)                               │    1000 │  384112.49 op/sec │ ±  1.00 % │ + 3.17 %                ║
║ crypto sha256 (no prealloc)                            │    1500 │  454828.00 op/sec │ ±  0.77 % │ + 22.16 %               ║
║ crypto sha512 (no prealloc)                            │   10000 │  455139.02 op/sec │ ±  5.29 % │ + 22.25 %               ║
║ crypto blake2b512 (no prealloc)                        │    1500 │  478152.72 op/sec │ ±  0.77 % │ + 28.43 %               ║
║ crypto sha512 (no prealloc, digest)                    │    1500 │  479625.05 op/sec │ ±  0.84 % │ + 28.82 %               ║
║ crypto sha256 (no prealloc, digest)                    │   10000 │  528125.65 op/sec │ ±  8.39 % │ + 41.85 %               ║
║ sodium-native generichash (state no reuse, digest)     │   10000 │  611080.95 op/sec │ ±  7.86 % │ + 64.13 %               ║
║ sodium-native generichash (32, state no reuse, digest) │   10000 │  618889.17 op/sec │ ±  8.50 % │ + 66.23 %               ║
║ crypto blake2b512 (no prealloc, digest)                │    1500 │  634007.66 op/sec │ ±  0.84 % │ + 70.29 %               ║
║ sodium-native generichash (state no reuse)             │   10000 │  696540.21 op/sec │ ±  9.83 % │ + 87.09 %               ║
║ sodium-native generichash (32, state no reuse)         │   10000 │  733222.33 op/sec │ ±  9.02 % │ + 96.94 %               ║
║ sodium-native generichash (32, no prealloc, digest)    │   10000 │  883429.92 op/sec │ ± 11.88 % │ + 137.28 %              ║
║ sodium-native generichash (no prealloc, digest)        │   10000 │  966337.35 op/sec │ ± 11.34 % │ + 159.55 %              ║
║ sodium-native generichash (state reuse, digest)        │    1500 │ 1085023.14 op/sec │ ±  0.77 % │ + 191.43 %              ║
║ sodium-native generichash (32, state reuse, digest)    │    1500 │ 1129635.46 op/sec │ ±  0.85 % │ + 203.41 %              ║
║ sodium-native generichash (no prealloc)                │   10000 │ 1200031.58 op/sec │ ± 14.04 % │ + 222.32 %              ║
║ sodium-native generichash (32, no prealloc)            │    1500 │ 1278665.55 op/sec │ ±  0.97 % │ + 243.44 %              ║
║ sodium-native generichash (prealloc, digest)           │   10000 │ 1301504.94 op/sec │ ± 14.47 % │ + 249.57 %              ║
║ sodium-native generichash (32, prealloc, digest)       │   10000 │ 1328428.24 op/sec │ ± 14.66 % │ + 256.81 %              ║
║ sodium-native generichash (32, state reuse)            │   10000 │ 1329011.92 op/sec │ ± 14.92 % │ + 256.96 %              ║
║ sodium-native generichash (state reuse)                │   10000 │ 1343705.12 op/sec │ ± 15.05 % │ + 260.91 %              ║
║ sodium-native generichash (32, prealloc)               │   10000 │ 1684187.27 op/sec │ ± 19.43 % │ + 352.36 %              ║
╟────────────────────────────────────────────────────────┼─────────┼───────────────────┼───────────┼─────────────────────────╢
║ Fastest test                                           │ Samples │            Result │ Tolerance │ Difference with slowest ║
╟────────────────────────────────────────────────────────┼─────────┼───────────────────┼───────────┼─────────────────────────╢
║ sodium-native generichash (prealloc)                   │   10000 │ 1738361.93 op/sec │ ± 19.31 % │ + 366.91 %              ║
╚════════════════════════════════════════════════════════╧═════════╧═══════════════════╧═══════════╧═════════════════════════╝
```

### 4096 bytes (4 kB)

```
╔════════════════════════════════════════════════════════╤═════════╤═══════════════════╤═══════════╤═════════════════════════╗
║ Slower tests                                           │ Samples │            Result │ Tolerance │ Difference with slowest ║
╟────────────────────────────────────────────────────────┼─────────┼───────────────────┼───────────┼─────────────────────────╢
║ crypto sha512 (no prealloc)                            │   10000 │  369661.84 op/sec │ ±  9.98 % │                         ║
║ crypto sha512 (prealloc)                               │    1000 │  380689.89 op/sec │ ±  0.99 % │ + 2.98 %                ║
║ crypto blake2b512 (prealloc)                           │   10000 │  382871.26 op/sec │ ±  6.72 % │ + 3.57 %                ║
║ crypto sha256 (prealloc)                               │    1000 │  386591.76 op/sec │ ±  1.00 % │ + 4.58 %                ║
║ crypto sha256 (no prealloc)                            │    1500 │  443099.52 op/sec │ ±  0.85 % │ + 19.87 %               ║
║ crypto blake2b512 (no prealloc)                        │   10000 │  457414.73 op/sec │ ±  7.44 % │ + 23.74 %               ║
║ crypto sha256 (no prealloc, digest)                    │   10000 │  548032.35 op/sec │ ±  9.94 % │ + 48.25 %               ║
║ crypto sha512 (no prealloc, digest)                    │    1500 │  570256.56 op/sec │ ±  0.81 % │ + 54.26 %               ║
║ crypto blake2b512 (no prealloc, digest)                │   10000 │  575250.97 op/sec │ ±  9.29 % │ + 55.62 %               ║
║ sodium-native generichash (state no reuse, digest)     │   10000 │  611746.59 op/sec │ ±  8.01 % │ + 65.49 %               ║
║ sodium-native generichash (32, state no reuse, digest) │   10000 │  639786.14 op/sec │ ±  7.20 % │ + 73.07 %               ║
║ sodium-native generichash (state no reuse)             │   10000 │  677225.74 op/sec │ ±  9.68 % │ + 83.20 %               ║
║ sodium-native generichash (32, state no reuse)         │   10000 │  689778.67 op/sec │ ± 10.06 % │ + 86.60 %               ║
║ sodium-native generichash (no prealloc, digest)        │   10000 │  951090.19 op/sec │ ± 11.43 % │ + 157.29 %              ║
║ sodium-native generichash (state reuse, digest)        │   10000 │  963677.73 op/sec │ ± 11.96 % │ + 160.69 %              ║
║ sodium-native generichash (32, no prealloc, digest)    │   10000 │ 1006172.77 op/sec │ ± 11.48 % │ + 172.19 %              ║
║ sodium-native generichash (32, state reuse, digest)    │    1500 │ 1141885.34 op/sec │ ±  0.93 % │ + 208.90 %              ║
║ sodium-native generichash (32, no prealloc)            │   10000 │ 1224765.39 op/sec │ ± 15.21 % │ + 231.32 %              ║
║ sodium-native generichash (no prealloc)                │    1500 │ 1295408.38 op/sec │ ±  0.96 % │ + 250.43 %              ║
║ sodium-native generichash (prealloc, digest)           │    1500 │ 1298480.95 op/sec │ ±  0.91 % │ + 251.26 %              ║
║ sodium-native generichash (state reuse)                │   10000 │ 1344304.29 op/sec │ ± 15.27 % │ + 263.66 %              ║
║ sodium-native generichash (32, state reuse)            │   10000 │ 1416489.18 op/sec │ ± 15.57 % │ + 283.19 %              ║
║ sodium-native generichash (32, prealloc, digest)       │    1500 │ 1422591.13 op/sec │ ±  0.97 % │ + 284.84 %              ║
║ sodium-native generichash (32, prealloc)               │   10000 │ 1719170.71 op/sec │ ± 18.64 % │ + 365.07 %              ║
╟────────────────────────────────────────────────────────┼─────────┼───────────────────┼───────────┼─────────────────────────╢
║ Fastest test                                           │ Samples │            Result │ Tolerance │ Difference with slowest ║
╟────────────────────────────────────────────────────────┼─────────┼───────────────────┼───────────┼─────────────────────────╢
║ sodium-native generichash (prealloc)                   │   10000 │ 1838778.14 op/sec │ ± 19.96 % │ + 397.42 %              ║
╚════════════════════════════════════════════════════════╧═════════╧═══════════════════╧═══════════╧═════════════════════════╝
```

### 2 ** 22 bytes (4 MB)

```
╔════════════════════════════════════════════════════════╤═════════╤═══════════════════╤═══════════╤═════════════════════════╗
║ Slower tests                                           │ Samples │            Result │ Tolerance │ Difference with slowest ║
╟────────────────────────────────────────────────────────┼─────────┼───────────────────┼───────────┼─────────────────────────╢
║ crypto sha512 (prealloc)                               │    1500 │  376676.21 op/sec │ ±  0.89 % │                         ║
║ crypto sha256 (prealloc)                               │    1500 │  380066.77 op/sec │ ±  0.83 % │ + 0.90 %                ║
║ crypto blake2b512 (prealloc)                           │    1000 │  404266.63 op/sec │ ±  0.99 % │ + 7.32 %                ║
║ crypto sha512 (no prealloc)                            │    1500 │  414760.15 op/sec │ ±  0.88 % │ + 10.11 %               ║
║ crypto sha256 (no prealloc)                            │   10000 │  415093.26 op/sec │ ±  6.46 % │ + 10.20 %               ║
║ crypto blake2b512 (no prealloc)                        │    1500 │  480911.04 op/sec │ ±  0.81 % │ + 27.67 %               ║
║ crypto sha256 (no prealloc, digest)                    │    1500 │  607580.42 op/sec │ ±  0.83 % │ + 61.30 %               ║
║ crypto sha512 (no prealloc, digest)                    │    1500 │  615386.89 op/sec │ ±  0.77 % │ + 63.37 %               ║
║ crypto blake2b512 (no prealloc, digest)                │    1500 │  631145.25 op/sec │ ±  0.80 % │ + 67.56 %               ║
║ sodium-native generichash (state no reuse, digest)     │   10000 │  658077.79 op/sec │ ±  7.58 % │ + 74.71 %               ║
║ sodium-native generichash (32, state no reuse)         │   10000 │  675431.84 op/sec │ ±  9.73 % │ + 79.31 %               ║
║ sodium-native generichash (32, state no reuse, digest) │   10000 │  679460.08 op/sec │ ±  7.46 % │ + 80.38 %               ║
║ sodium-native generichash (state no reuse)             │   10000 │  705066.12 op/sec │ ±  9.27 % │ + 87.18 %               ║
║ sodium-native generichash (no prealloc, digest)        │   10000 │  922448.55 op/sec │ ± 10.81 % │ + 144.89 %              ║
║ sodium-native generichash (32, no prealloc, digest)    │   10000 │  964307.23 op/sec │ ± 11.74 % │ + 156.00 %              ║
║ sodium-native generichash (state reuse, digest)        │   10000 │ 1062845.19 op/sec │ ± 11.89 % │ + 182.16 %              ║
║ sodium-native generichash (32, state reuse, digest)    │   10000 │ 1102679.90 op/sec │ ± 12.22 % │ + 192.74 %              ║
║ sodium-native generichash (no prealloc)                │   10000 │ 1105141.51 op/sec │ ± 14.53 % │ + 193.39 %              ║
║ sodium-native generichash (prealloc, digest)           │   10000 │ 1211828.61 op/sec │ ± 13.80 % │ + 221.72 %              ║
║ sodium-native generichash (32, no prealloc)            │   10000 │ 1324412.97 op/sec │ ± 14.42 % │ + 251.61 %              ║
║ sodium-native generichash (state reuse)                │   10000 │ 1364409.49 op/sec │ ± 15.10 % │ + 262.22 %              ║
║ sodium-native generichash (32, state reuse)            │   10000 │ 1370257.76 op/sec │ ± 14.99 % │ + 263.78 %              ║
║ sodium-native generichash (32, prealloc, digest)       │    1500 │ 1398581.84 op/sec │ ±  0.97 % │ + 271.30 %              ║
║ sodium-native generichash (prealloc)                   │   10000 │ 1638734.17 op/sec │ ± 18.44 % │ + 335.05 %              ║
╟────────────────────────────────────────────────────────┼─────────┼───────────────────┼───────────┼─────────────────────────╢
║ Fastest test                                           │ Samples │            Result │ Tolerance │ Difference with slowest ║
╟────────────────────────────────────────────────────────┼─────────┼───────────────────┼───────────┼─────────────────────────╢
║ sodium-native generichash (32, prealloc)               │   10000 │ 1706066.86 op/sec │ ± 20.97 % │ + 352.93 %              ║
╚════════════════════════════════════════════════════════╧═════════╧═══════════════════╧═══════════╧═════════════════════════╝
```
