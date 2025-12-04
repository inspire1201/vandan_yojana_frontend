


// utils/useHierarchy.js

/**
 * Builds the hierarchical structure and calculates the counts for
 * the lower levels based on the current 'upTo' level.
 *
 * @param {Array<Object>} data - The flat list of records.
 * @param {'sambhag' | 'jila' | 'vidhansabha' | 'mandal' | 'sakha' | 'booth'} upTo - The level to group the report by.
 * @returns {Array<Object>} The structured and counted hierarchy for display.
 */
export const buildReportHierarchy = (data: any[], upTo: string) => {
    const sambhagsMap = new Map();
    // console.log("Building report hierarchy up to:", upTo);


    data.forEach((item: any) => {
        // 1️⃣ Sambhag
        if (!sambhagsMap.has(item.id)) {
            sambhagsMap.set(item.id, {
                sambhagId: item.id,
                sambhagName: item.name,
                jilas: new Map(),
                totalJilas: 0,
                totalVidhans: 0,
                totalMandals: 0,
                totalSakhas: 0,
                totalBooths: 0,
                visibleChildren: []
            });
        }
        const sambhag = sambhagsMap.get(item.id);
        sambhag.totalBooths += 1;

        // 2️⃣ Jila
        if (!sambhag.jilas.has(item.childId)) {
            sambhag.jilas.set(item.childId, {
                jilaId: item.childId,
                jilaName: item.childName,
                vidhans: new Map(),
                totalVidhans: 0,
                totalMandals: 0,
                totalSakhas: 0,
                totalBooths: 0,
            });
            sambhag.totalJilas += 1;
        }
        const jila = sambhag.jilas.get(item.childId);
        jila.totalBooths += 1;

        // 3️⃣ Vidhan Sabha
        if (!jila.vidhans.has(item.vidId)) {
            // console.log("jila in vidhans:",jila.vidhans);
            jila.vidhans.set(item.vidId, {
                
                vidId: item.vidId,
                vidName: item.vidhanSabha,
                jilaName: item.childName, // Context property
                mandals: new Map(),
                totalMandals: 0,
                totalSakhas: 0,
                totalBooths: 0,
            });
            jila.totalVidhans += 1;
            sambhag.totalVidhans += 1;
        }
        const vid = jila.vidhans.get(item.vidId);
        vid.totalBooths += 1;

        // 4️⃣ Mandal
        if (!vid.mandals.has(item.manId)) {
            vid.mandals.set(item.manId, {
                manId: item.manId,
                manName: item.manName,
                vidName: item.vidhanSabha,   // Context property
                jilaName: item.childName, // Context property
                sakhas: new Map(),
                totalSakhas: 0,
                totalBooths: 0,
            });
            vid.totalMandals += 1;
            jila.totalMandals += 1;
            sambhag.totalMandals += 1;
        }
        const mandal = vid.mandals.get(item.manId);
        mandal.totalBooths += 1;

        // 5️⃣ Sakha
        if (!mandal.sakhas.has(item.sakId)) {
            mandal.sakhas.set(item.sakId, {
                sakId: item.sakId,
                sakName: item.sakName,
                mandalName: item.manName, // Context property
                vidName: item.vidhanSabha,   // Context property
                jilaName: item.childName, // Context property
                booths: new Map(),
                totalBooths: 0,
            });
            mandal.totalSakhas += 1;
            vid.totalSakhas += 1;
            jila.totalSakhas += 1;
            sambhag.totalSakhas += 1;
        }
        const sakha = mandal.sakhas.get(item.sakId);
        sakha.totalBooths += 1;

        // 6️⃣ Booth
        if (!sakha.booths.has(item.btId)) {
            sakha.booths.set(item.btId, {
                boothId: item.btId,
                boothName: item.btName,
                sakhaName: item.sakName,  // Context property
                mandalName: item.manName, // Context property
                vidName: item.vidhanSabha,    // Context property
                jilaName: item.childName, // Context property
            });
        }
    });

    // console.log("sambhag map", sambhagsMap)
    // --- Final Structuring and Visibility Control ---

    const finalReport = Array.from(sambhagsMap.values()).map(sambhag => {
        const { jilas, ...sambhagData } = sambhag;

        sambhagData.visibleChildren = [];

        Array.from(jilas.values()).forEach((jila: any) => {
            if (upTo === 'jila') {
                // JILA LEVEL: Jila object is the final child
                sambhagData.visibleChildren.push({ ...jila, vidhans: undefined });
            } else {
                Array.from(jila.vidhans.values()).forEach((vid: any) => {
                    if (upTo === 'vidhansabha') {
                        // console.log("Adding Vidhan Sabha:", vid.vid);
                        // VIDHANSABHA LEVEL: Vidhan Sabha object is the final child
                        sambhagData.visibleChildren.push({ ...vid, mandals: undefined, jilaName: jila.jilaName });
                    } else {
                        Array.from(vid.mandals.values()).forEach((mandal: any) => {
                            if (upTo === 'mandal') {
                                // MANDAL LEVEL: Mandal object is the final child
                                sambhagData.visibleChildren.push({ ...mandal, sakhas: undefined, vidName: vid.vidName, jilaName: jila.jilaName });
                            } else {
                                Array.from(mandal.sakhas.values()).forEach((sakha: any) => {
                                    if (upTo === 'shakti') {
                                        // SHAKTI LEVEL: Shakti object is the final child
                                        sambhagData.visibleChildren.push({ ...sakha, booths: undefined, mandalName: mandal.manName, vidName: vid.vidName, jilaName: jila.jilaName });
                                    } else if (upTo === 'booth') {
                                        // BOOTH LEVEL: Booth object is the final child
                                        Array.from(sakha.booths.values()).forEach((booth: any) => {
                                            sambhagData.visibleChildren.push({
                                                ...booth,
                                                sakId: sakha.sakId,
                                                sakName: sakha.sakName,
                                                sakhaName: sakha.sakName,
                                                mandalName: mandal.manName,
                                                vidName: vid.vidName,
                                                jilaName: jila.jilaName
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        return sambhagData;
    });

    return finalReport;
};