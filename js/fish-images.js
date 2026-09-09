// ========================================
// FishFinder - Fish Image System
// ระบบรูปปลาแบบไม่ทำรูปเดิมหาย
// ========================================

const FISH_IMAGE_CACHE_KEY =
    "fishFinderImageCacheV3";


// ========================================
// Cache
// ========================================

function getImageCache() {

    try {

        return JSON.parse(
            localStorage.getItem(
                FISH_IMAGE_CACHE_KEY
            )
        ) || {};

    } catch (error) {

        return {};

    }

}


function saveImageCache(cache) {

    try {

        localStorage.setItem(
            FISH_IMAGE_CACHE_KEY,
            JSON.stringify(cache)
        );

    } catch (error) {

        console.log(
            "ไม่สามารถบันทึก cache"
        );

    }

}


// ========================================
// แปลงชื่อให้เปรียบเทียบง่าย
// ========================================

function normalizeName(name) {

    return (name || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}


// ========================================
// ตรวจชื่อว่าเป็น Scientific Name
// ========================================

function isSpeciesName(name) {

    const parts =
        normalizeName(name)
            .split(" ");

    return parts.length >= 2;

}


// ========================================
// ค้นหารูปจาก Wikimedia Commons
// แต่รับเฉพาะผลที่ชื่อไฟล์ตรงกับชื่อวิทยาศาสตร์
// ========================================

async function findCommonsImage(
    scientificName
) {

    const api =
        "https://commons.wikimedia.org/w/api.php" +
        "?action=query" +
        "&generator=search" +
        "&gsrnamespace=6" +
        "&gsrsearch=" +
        encodeURIComponent(
            scientificName
        ) +
        "&gsrlimit=20" +
        "&prop=imageinfo" +
        "&iiprop=url|mime" +
        "&iiurlwidth=1000" +
        "&format=json" +
        "&origin=*";


    const response =
        await fetch(api);


    if (!response.ok) {

        return null;

    }


    const data =
        await response.json();


    const pages =
        data.query?.pages;


    if (!pages) {

        return null;

    }


    const searchName =
        normalizeName(
            scientificName
        );


    const candidates =
        Object.values(pages);


    // ------------------------------------
    // ให้ความสำคัญกับชื่อไฟล์ที่ตรง
    // ------------------------------------

    candidates.sort(
        function (a, b) {

            const aTitle =
                normalizeName(
                    a.title
                );

            const bTitle =
                normalizeName(
                    b.title
                );


            const aExact =
                aTitle.includes(
                    searchName
                )
                    ? 1
                    : 0;


            const bExact =
                bTitle.includes(
                    searchName
                )
                    ? 1
                    : 0;


            return bExact - aExact;

        }
    );


    for (
        const page
        of candidates
    ) {

        const info =
            page.imageinfo?.[0];


        if (!info) {

            continue;

        }


        // รับเฉพาะรูปภาพ

        const mime =
            (
                info.mime ||
                ""
            ).toLowerCase();


        if (
            !mime.startsWith(
                "image/"
            )
        ) {

            continue;

        }


        const title =
            normalizeName(
                page.title
            );


        // ต้องมีชื่อวิทยาศาสตร์
        // อยู่ในชื่อไฟล์จริง

        if (
            !title.includes(
                searchName
            )
        ) {

            continue;

        }


        const imageUrl =
            info.thumburl ||
            info.url;


        if (!imageUrl) {

            continue;

        }


        return imageUrl;

    }


    return null;

}


// ========================================
// ตรวจสอบชื่อกับ GBIF
// ========================================

async function verifyScientificName(
    scientificName
) {

    try {

        const url =
            "https://api.gbif.org/v2/species/match?scientificName=" +
            encodeURIComponent(
                scientificName
            );


        const response =
            await fetch(url);


        if (!response.ok) {

            return null;

        }


        const data =
            await response.json();


        return data;

    } catch (error) {

        return null;

    }

}


// ========================================
// ตรวจว่าตรง Species จริง
// ========================================

function isVerifiedSpecies(
    result,
    scientificName
) {

    if (!result) {

        return false;

    }


    const usage =
        result.usage || result;


    const canonicalName =
        normalizeName(
            usage.canonicalName
        );


    const requestedName =
        normalizeName(
            scientificName
        );


    if (
        usage.rank !==
        "SPECIES"
    ) {

        return false;

    }


    if (
        usage.status !==
            "ACCEPTED" &&
        usage.status !==
            "DOUBTFUL"
    ) {

        return false;

    }


    return (
        canonicalName ===
        requestedName
    );

}


// ========================================
// โหลดรูป 1 ใบ
// ========================================

async function loadFishImage(
    card
) {

    const image =
        card.querySelector(
            ".fish-photo"
        );


    if (!image) {

        return;

    }


    const scientificName =
        (
            card.dataset.photoSearch ||
            ""
        ).trim();


    const fishName =
        card.dataset.name ||
        "ปลานี้";


    // สำคัญ:
    // เก็บรูปเดิมไว้เสมอ

    const originalSrc =
        image.getAttribute(
            "src"
        );


    if (
        !scientificName ||
        !isSpeciesName(
            scientificName
        )
    ) {

        console.log(
            "ใช้รูปเดิม:",
            fishName
        );

        return;

    }


    const cache =
        getImageCache();


    // ------------------------------------
    // ใช้ cache
    // ------------------------------------

    if (
        cache[scientificName]
    ) {

        image.src =
            cache[scientificName];

        image.dataset.autoMatched =
            "true";

        image.dataset.imageSource =
            "Commons";

        console.log(
            "ใช้รูปจาก cache:",
            fishName
        );

        return;

    }


    try {

        // --------------------------------
        // ตรวจชื่อก่อน
        // --------------------------------

        const verify =
            await verifyScientificName(
                scientificName
            );


        if (
            !isVerifiedSpecies(
                verify,
                scientificName
            )
        ) {

            console.log(
                "ชื่อยังไม่ผ่านการตรวจ:",
                fishName,
                scientificName
            );

            // ใช้รูปเดิม
            if (originalSrc) {

                image.src =
                    originalSrc;

            }

            return;

        }


        // --------------------------------
        // ค้นรูป Commons
        // --------------------------------

        const source =
            await findCommonsImage(
                scientificName
            );


        // --------------------------------
        // เจอรูป
        // --------------------------------

        if (source) {

            image.src =
                source;

            image.dataset.autoMatched =
                "true";

            image.dataset.imageSource =
                "Wikimedia Commons";


            cache[
                scientificName
            ] = source;


            saveImageCache(
                cache
            );


            console.log(
                "✅ รูปใหม่:",
                fishName,
                scientificName
            );


            return;

        }


        // --------------------------------
        // ไม่เจอรูป
        // ใช้รูปเดิม
        // --------------------------------

        if (originalSrc) {

            image.src =
                originalSrc;

        }


        console.log(
            "ℹ️ ใช้รูปเดิม:",
            fishName
        );


    } catch (error) {

        // --------------------------------
        // เกิด error
        // ห้ามทำรูปหาย
        // --------------------------------

        if (originalSrc) {

            image.src =
                originalSrc;

        }


        console.log(
            "⚠️ ใช้รูปเดิม:",
            fishName
        );

    }

}


// ========================================
// เริ่มระบบ
// ========================================

function startFishImageSystem() {

    const cards =
        document.querySelectorAll(
            ".fish-card"
        );


    cards.forEach(
        function (card) {

            loadFishImage(
                card
            );

        }
    );

}


// ========================================
// เริ่มเมื่อหน้าเว็บพร้อม
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    startFishImageSystem
);