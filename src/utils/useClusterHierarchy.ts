/**
 * Builds hierarchical tree structure for cluster-based reports
 * @param {Array<Object>} data
 * @param {'cluster'|'lok'|'vidhansabha'|'mandal'|'sakha'|'booth'} upTo
 * @returns {Array<Object>}
 */
export const buildClusterReport = (data: any[], upTo: string) => {

    const clustersMap = new Map();

    data.forEach((item: any) => {

        // =======================
        // 1. CLUSTER
        // =======================
        if (!clustersMap.has(item.id)) {
            clustersMap.set(item.id, {
                clusterId: item.id,
                clusterName: item.name,
                loks: new Map(),
                totalLoks: 0,
                totalVidhans: 0,
                totalMandals: 0,
                totalSakhas: 0,
                totalBooths: 0,
                visibleChildren: []
            });
        }

        const cluster = clustersMap.get(item.id);
        cluster.totalBooths++;

        // =======================
        // 2. LOK SABHA
        // =======================
        if (!cluster.loks.has(item.childId)) {
            cluster.loks.set(item.childId, {
                lokId: item.childId,
                lokName: item.childName,
                vidhans: new Map(),
                totalVidhans: 0,
                totalMandals: 0,
                totalSakhas: 0,
                totalBooths: 0,
            });
            cluster.totalLoks++;
        }
        const loksbha = cluster.loks.get(item.childId);
        loksbha.totalBooths++;

        // =======================
        // 3. VIDHAN SABHA
        // =======================
        if (!loksbha.vidhans.has(item.vidId)) {
            loksbha.vidhans.set(item.vidId, {
                vidId: item.vidId,
                vidName: item.vidhanSabha,
                lokName: item.childName,
                mandals: new Map(),
                totalMandals: 0,
                totalSakhas: 0,
                totalBooths: 0,
            });
            loksbha.totalVidhans++;
            cluster.totalVidhans++;
        }

        const vid = loksbha.vidhans.get(item.vidId);
        vid.totalBooths++;

        // =======================
        // 4. MANDAL
        // =======================
        if (!vid.mandals.has(item.manId)) {
            vid.mandals.set(item.manId, {
                manId: item.manId,
                manName: item.manName,
                lokName: item.childName,
                vidName: item.vidhanSabha,
                sakhas: new Map(),
                totalSakhas: 0,
                totalBooths: 0,
            });
            vid.totalMandals++;
            loksbha.totalMandals++;
            cluster.totalMandals++;
        }

        const mandal = vid.mandals.get(item.manId);
        mandal.totalBooths++;

        // =======================
        // 5. SAKHA
        // =======================
        if (!mandal.sakhas.has(item.sakId)) {
            mandal.sakhas.set(item.sakId, {
                sakId: item.sakId,
                sakName: item.sakName,
                mandalName: item.manName,
                vidName: item.vidhanSabha,
                lokName: item.childName,
                booths: new Map(),
                totalBooths: 0,
            });
            mandal.totalSakhas++;
            vid.totalSakhas++;
            loksbha.totalSakhas++;
            cluster.totalSakhas++;
        }
        const sakha = mandal.sakhas.get(item.sakId);
        sakha.totalBooths++;

        // =======================
        // 6. BOOTH
        // =======================
        if (!sakha.booths.has(item.btId)) {
            sakha.booths.set(item.btId, {
                boothId: item.btId,
                boothName: item.btName,
                sakhaName: item.sakName,
                mandalName: item.manName,
                vidName: item.vidhanSabha,
                lokName: item.childName,
            });
        }
    });

    // ===============================
    // Build Visible Children
    // ===============================
    const finalReport = Array.from(clustersMap.values()).map(cluster => {
        const { loks, ...clusterData } = cluster;
        clusterData.visibleChildren = [];

        Array.from(loks.values()).forEach((lok: any) => {
            if (upTo === "lok") {
                clusterData.visibleChildren.push({ ...lok });
                return;
            }

            Array.from(lok.vidhans.values()).forEach((vid: any) => {
                if (upTo === "vidhansabha") {
                    clusterData.visibleChildren.push({ ...vid });
                    return;
                }

                Array.from(vid.mandals.values()).forEach((mandal: any) => {
                    if (upTo === "mandal") {
                        clusterData.visibleChildren.push({ ...mandal });
                        return;
                    }

                    Array.from(mandal.sakhas.values()).forEach((sakha: any) => {
                        if (upTo === "sakha") {
                            clusterData.visibleChildren.push({ ...sakha });
                            return;
                        }

                        if (upTo === "booth") {
                            Array.from(sakha.booths.values()).forEach((booth: any) => {
                                clusterData.visibleChildren.push({ ...booth });
                            });
                        }
                    });
                });
            });
        });

        return clusterData;
    });

    return finalReport;
};
