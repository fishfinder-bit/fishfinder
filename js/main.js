// ========================================
// FishFinder - main.js
// ========================================


// ========================================
// 1. HOME SEARCH
// ========================================

const homeSearchInput =
    document.getElementById("searchInput");

const homeSearchButton =
    document.getElementById("searchButton");


if (
    homeSearchInput &&
    homeSearchButton
) {

    homeSearchButton.addEventListener(
        "click",
        function () {

            const keyword =
                homeSearchInput.value
                    .trim()
                    .toLowerCase();


            if (keyword === "") {

                window.location.href =
                    "fish.html";

                return;
            }


            window.location.href =
                "fish.html?search=" +
                encodeURIComponent(
                    keyword
                );
        }
    );
}


// ========================================
// 2. URL PARAMETERS
// ========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const urlSearch =
    (
        urlParams.get("search") ||
        ""
    )
        .trim()
        .toLowerCase();


// ========================================
// 3. FISH GUIDE - SEARCH / FILTER
// ========================================

const fishSearchInput =
    document.getElementById(
        "fishSearchInput"
    );


const fishTypeFilter =
    document.getElementById(
        "fishType"
    );


const fishSort =
    document.getElementById(
        "fishSort"
    );


const fishList =
    document.getElementById(
        "fishList"
    );


const fishCountElement =
    document.getElementById(
        "fishCount"
    );


const noResult =
    document.getElementById(
        "noResult"
    );


function filterFish() {

    if (!fishList) {
        return;
    }


    const keyword =
        fishSearchInput
            ? fishSearchInput.value
                .trim()
                .toLowerCase()
            : urlSearch;


    const selectedType =
        fishTypeFilter
            ? fishTypeFilter.value
            : "all";


    const fishCards =
        fishList.querySelectorAll(
            ".fish-card"
        );


    let visibleCount = 0;


    fishCards.forEach(
        function (card) {

            const name =
                (
                    card.dataset.name ||
                    ""
                ).toLowerCase();


            const type =
                (
                    card.dataset.type ||
                    ""
                ).toLowerCase();


            const bait =
                (
                    card.dataset.bait ||
                    ""
                ).toLowerCase();


            const time =
                (
                    card.dataset.time ||
                    ""
                ).toLowerCase();


            const scientificName =
                (
                    card.dataset.photoSearch ||
                    ""
                ).toLowerCase();


            const wikiTitle =
                (
                    card.dataset.wikiTitle ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                keyword === "" ||
                name.includes(keyword) ||
                type.includes(keyword) ||
                bait.includes(keyword) ||
                time.includes(keyword) ||
                scientificName.includes(keyword) ||
                wikiTitle.includes(keyword);


            const matchesType =
                selectedType === "all" ||
                card.dataset.type ===
                selectedType;


            if (
                matchesSearch &&
                matchesType
            ) {

                /*
                 * สำคัญ:
                 * ใช้ display = ""
                 * เพื่อไม่ทับ CSS Grid/List
                 */

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display =
                    "none";
            }
        }
    );


    if (noResult) {

        noResult.style.display =
            visibleCount > 0
                ? "none"
                : "block";
    }


    if (fishCountElement) {

        fishCountElement.textContent =
            "🐟 พบปลา " +
            visibleCount +
            " ชนิด";
    }
}


// ใส่คำค้นจาก Home
if (fishSearchInput) {

    fishSearchInput.value =
        urlSearch;


    fishSearchInput.addEventListener(
        "input",
        function () {

            filterFish();
        }
    );
}


// เปลี่ยนประเภทปลา
if (fishTypeFilter && fishList) {

    fishTypeFilter.addEventListener(
        "change",
        function () {

            filterFish();
        }
    );
}


// ========================================
// 4. FISH GUIDE - SORT
// ========================================

const originalFishOrder =
    fishList
        ? Array.from(
            fishList.querySelectorAll(
                ".fish-card"
            )
        )
        : [];


function getDifficultyLevel(card) {

    const fishName =
        card.dataset.name ||
        "";


    let fishInfo = null;


    if (
        typeof fishDetails !==
        "undefined"
    ) {

        fishInfo =
            fishDetails[fishName] ||
            null;
    }


    if (!fishInfo) {

        return 999;
    }


    const difficulty =
        fishInfo.difficulty ||
        "";


    const stars =
        (
            difficulty.match(
                /⭐/g
            ) || []
        ).length;


    return stars > 0
        ? stars
        : 999;
}


function sortFish() {

    if (!fishList) {
        return;
    }


    const cards =
        Array.from(
            fishList.querySelectorAll(
                ".fish-card"
            )
        );


    const sortType =
        fishSort
            ? fishSort.value
            : "default";


    // ค่าเริ่มต้น
    if (
        sortType ===
        "default"
    ) {

        originalFishOrder.forEach(
            function (card) {

                fishList.appendChild(
                    card
                );
            }
        );


        filterFish();

        return;
    }


    // เรียงตามชื่อ
    if (
        sortType ===
        "name"
    ) {

        cards.sort(
            function (a, b) {

                const nameA =
                    a.dataset.name ||
                    "";

                const nameB =
                    b.dataset.name ||
                    "";


                return nameA.localeCompare(
                    nameB,
                    "th"
                );
            }
        );
    }


    // เรียงตามประเภท
    else if (
        sortType ===
        "type"
    ) {

        cards.sort(
            function (a, b) {

                const typeA =
                    a.dataset.type ||
                    "";

                const typeB =
                    b.dataset.type ||
                    "";


                return typeA.localeCompare(
                    typeB,
                    "th"
                );
            }
        );
    }


    // เรียงตามระดับความยาก
    else if (
        sortType ===
        "difficulty"
    ) {

        cards.sort(
            function (a, b) {

                const difficultyA =
                    getDifficultyLevel(a);


                const difficultyB =
                    getDifficultyLevel(b);


                return (
                    difficultyA -
                    difficultyB
                );
            }
        );
    }


    cards.forEach(
        function (card) {

            fishList.appendChild(
                card
            );
        }
    );


    filterFish();
}


if (fishSort) {

    fishSort.addEventListener(
        "change",
        function () {

            sortFish();
        }
    );
}


// ========================================
// 5. BADGE
// ========================================

const badgeFishCards =
    document.querySelectorAll(
        ".fish-card"
    );


badgeFishCards.forEach(
    function (card) {

        const type =
            card.dataset.type;


        if (!type) {
            return;
        }


        if (
            card.querySelector(
                ".fish-badge"
            )
        ) {

            return;
        }


        const badge =
            document.createElement(
                "span"
            );


        badge.className =
            "fish-badge";


        if (
            type === "น้ำจืด"
        ) {

            badge.textContent =
                "💧 น้ำจืด";

        }

        else if (
            type === "ทะเล"
        ) {

            badge.textContent =
                "🌊 ทะเล";

        }

        else {

            badge.textContent =
                type;
        }


        const image =
            card.querySelector(
                "img"
            );


        if (image) {

            image.insertAdjacentElement(
                "afterend",
                badge
            );

        } else {

            card.prepend(
                badge
            );
        }
    }
);


// โหลด Fish Guide ครั้งแรก
if (fishList) {

    filterFish();

    sortFish();
}


// ========================================
// 6. FISH MODAL
// ========================================

const fishModal =
    document.getElementById(
        "fishModal"
    );


if (fishModal) {

    const modalImage =
        document.getElementById(
            "modalImage"
        );


    const modalName =
        document.getElementById(
            "modalName"
        );


    const modalType =
        document.getElementById(
            "modalType"
        );


    const modalBait =
        document.getElementById(
            "modalBait"
        );


    const modalTime =
        document.getElementById(
            "modalTime"
        );


    const modalSize =
        document.getElementById(
            "modalSize"
        );


    const modalHabitat =
        document.getElementById(
            "modalHabitat"
        );


    const modalDifficulty =
        document.getElementById(
            "modalDifficulty"
        );


    const modalClose =
        document.getElementById(
            "modalClose"
        );


    const modalCloseButton =
        document.getElementById(
            "modalCloseButton"
        );


    const saveFishButton =
        document.getElementById(
            "saveFishButton"
        );


    // คลิกการ์ด
    document.addEventListener(
        "click",
        function (event) {

            const card =
                event.target.closest(
                    ".fish-card"
                );


            if (!card) {
                return;
            }


            const name =
                card.dataset.name ||
                "ไม่ทราบชื่อ";


            const type =
                card.dataset.type ||
                "ไม่ทราบประเภท";


            const bait =
                card.dataset.bait ||
                "ไม่ระบุ";


            const time =
                card.dataset.time ||
                "ไม่ระบุ";


            let fishInfo =
                null;


            if (
                typeof fishDetails !==
                "undefined"
            ) {

                fishInfo =
                    fishDetails[name] ||
                    null;
            }


            const size =
                fishInfo &&
                    fishInfo.size
                    ? fishInfo.size
                    : (
                        card.dataset.size ||
                        "ยังไม่มีข้อมูล"
                    );


            const habitat =
                fishInfo &&
                    fishInfo.habitat
                    ? fishInfo.habitat
                    : (
                        card.dataset.habitat ||
                        "ยังไม่มีข้อมูล"
                    );


            const difficulty =
                fishInfo &&
                    fishInfo.difficulty
                    ? fishInfo.difficulty
                    : (
                        card.dataset.difficulty ||
                        "ยังไม่มีข้อมูล"
                    );


            const image =
                card.querySelector(
                    "img"
                );


            if (
                image &&
                modalImage
            ) {

                modalImage.src =
                    image.currentSrc ||
                    image.src;


                modalImage.alt =
                    image.alt ||
                    name;
            }


            if (modalName) {

                modalName.textContent =
                    "🐟 " + name;
            }


            if (modalType) {

                modalType.textContent =
                    "🌊 ประเภท: " +
                    type;
            }


            if (modalBait) {

                modalBait.textContent =
                    "🎣 เหยื่อที่แนะนำ: " +
                    bait;
            }


            if (modalTime) {

                modalTime.textContent =
                    "⏰ ช่วงเวลาที่เหมาะ: " +
                    time;
            }


            if (modalSize) {

                modalSize.textContent =
                    "📏 ขนาดโดยประมาณ: " +
                    size;
            }


            if (modalHabitat) {

                modalHabitat.textContent =
                    "📍 แหล่งอาศัย: " +
                    habitat;
            }


            if (modalDifficulty) {

                modalDifficulty.textContent =
                    "⭐ ระดับความยาก: " +
                    difficulty;
            }


            if (saveFishButton) {

                saveFishButton.dataset.name =
                    name;


                saveFishButton.dataset.type =
                    type;
            }


            fishModal.style.display =
                "flex";
        }
    );


    // X
    if (modalClose) {

        modalClose.addEventListener(
            "click",
            function () {

                fishModal.style.display =
                    "none";
            }
        );
    }


    // ปุ่มปิด
    if (modalCloseButton) {

        modalCloseButton.addEventListener(
            "click",
            function () {

                fishModal.style.display =
                    "none";
            }
        );
    }


    // คลิกพื้นหลัง
    fishModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                fishModal
            ) {

                fishModal.style.display =
                    "none";
            }
        }
    );


    // บันทึกปลาตัวนี้
    if (saveFishButton) {

        saveFishButton.addEventListener(
            "click",
            function () {

                const name =
                    saveFishButton.dataset.name;


                const type =
                    saveFishButton.dataset.type;


                if (
                    !name ||
                    !type
                ) {

                    return;
                }


                window.location.href =
                    "log.html?fish=" +
                    encodeURIComponent(
                        name
                    ) +
                    "&type=" +
                    encodeURIComponent(
                        type
                    );
            }
        );
    }
}


// ========================================
// 7. LOG - PREFILL FROM FISH GUIDE
// ========================================

const fishFromGuide =
    urlParams.get(
        "fish"
    );


const typeFromGuide =
    urlParams.get(
        "type"
    );


const fishNameInput =
    document.getElementById(
        "fishName"
    );


const fishTypeInput =
    document.getElementById(
        "fishType"
    );


if (
    fishFromGuide &&
    fishNameInput
) {

    fishNameInput.value =
        fishFromGuide;


    if (fishTypeInput) {

        fishTypeInput.value =
            typeFromGuide ||
            "";
    }
}


// ========================================
// 8. LOG - SAVE
// ========================================

const saveLog =
    document.getElementById(
        "saveLog"
    );


if (saveLog) {

    saveLog.addEventListener(
        "click",
        function () {

            const nameElement =
                document.getElementById(
                    "fishName"
                );


            const typeElement =
                document.getElementById(
                    "fishType"
                );


            const locationElement =
                document.getElementById(
                    "location"
                );


            const dateElement =
                document.getElementById(
                    "fishingDate"
                );


            const weightElement =
                document.getElementById(
                    "fishWeight"
                );


            const lengthElement =
                document.getElementById(
                    "fishLength"
                );


            const noteElement =
                document.getElementById(
                    "fishNote"
                );


            const fishName =
                nameElement
                    ? nameElement.value.trim()
                    : "";


            const fishType =
                typeElement
                    ? typeElement.value
                    : "";


            const location =
                locationElement
                    ? locationElement.value.trim()
                    : "";


            const fishingDate =
                dateElement
                    ? dateElement.value
                    : "";


            const fishWeight =
                weightElement
                    ? weightElement.value
                    : "";


            const fishLength =
                lengthElement
                    ? lengthElement.value
                    : "";


            const fishNote =
                noteElement
                    ? noteElement.value.trim()
                    : "";


            if (
                fishName === "" ||
                fishType === "" ||
                location === "" ||
                fishingDate === ""
            ) {

                alert(
                    "กรุณากรอกข้อมูลให้ครบ"
                );

                return;
            }


            const newLog = {

                fishName:
                    fishName,

                fishType:
                    fishType,

                location:
                    location,

                fishingDate:
                    fishingDate,

                fishWeight:
                    fishWeight,

                fishLength:
                    fishLength,

                fishNote:
                    fishNote
            };


            let logs = [];


            try {

                logs =
                    JSON.parse(
                        localStorage.getItem(
                            "fishingLogs"
                        )
                    ) || [];

            } catch (error) {

                logs = [];
            }


            logs.push(
                newLog
            );


            localStorage.setItem(
                "fishingLogs",
                JSON.stringify(logs)
            );


            alert(
                "บันทึกข้อมูลเรียบร้อยแล้ว"
            );


            if (nameElement) {
                nameElement.value = "";
            }


            if (typeElement) {
                typeElement.value = "";
            }


            if (locationElement) {
                locationElement.value = "";
            }


            if (dateElement) {
                dateElement.value = "";
            }


            if (weightElement) {
                weightElement.value = "";
            }


            if (lengthElement) {
                lengthElement.value = "";
            }


            if (noteElement) {
                noteElement.value = "";
            }


            refreshAll();
        }
    );
}


// ========================================
// 9. LOG - SEARCH / FILTER / SORT
// ========================================

const logSearchInput =
    document.getElementById(
        "logSearchInput"
    );


const logTypeFilter =
    document.getElementById(
        "logTypeFilter"
    );


const logSort =
    document.getElementById(
        "logSort"
    );


if (logSearchInput) {

    logSearchInput.addEventListener(
        "input",
        function () {

            showLogs();
        }
    );
}


if (logTypeFilter) {

    logTypeFilter.addEventListener(
        "change",
        function () {

            showLogs();
        }
    );
}


if (logSort) {

    logSort.addEventListener(
        "change",
        function () {

            showLogs();
        }
    );
}


// ========================================
// 10. LOG - SHOW
// ========================================

function showLogs() {

    const logList =
        document.getElementById(
            "logList"
        );


    if (!logList) {
        return;
    }


    let logs = [];


    try {

        logs =
            JSON.parse(
                localStorage.getItem(
                    "fishingLogs"
                )
            ) || [];

    } catch (error) {

        console.error(error);

        logs = [];
    }


    logList.innerHTML =
        "";


    const keyword =
        logSearchInput
            ? logSearchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedType =
        logTypeFilter
            ? logTypeFilter.value
            : "all";


    const selectedSort =
        logSort
            ? logSort.value
            : "newest";


    // -----------------------------
    // Filter
    // -----------------------------

    const filteredLogs =
        logs.filter(
            function (log) {

                const fishName =
                    (
                        log.fishName ||
                        ""
                    ).toLowerCase();


                const fishType =
                    (
                        log.fishType ||
                        ""
                    ).toLowerCase();


                const location =
                    (
                        log.location ||
                        ""
                    ).toLowerCase();


                const note =
                    (
                        log.fishNote ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    keyword === "" ||
                    fishName.includes(
                        keyword
                    ) ||
                    fishType.includes(
                        keyword
                    ) ||
                    location.includes(
                        keyword
                    ) ||
                    note.includes(
                        keyword
                    );


                const matchesType =
                    selectedType === "all" ||
                    log.fishType ===
                    selectedType;


                return (
                    matchesSearch &&
                    matchesType
                );
            }
        );


    // -----------------------------
    // Sort
    // -----------------------------

    filteredLogs.sort(
        function (a, b) {

            if (
                selectedSort ===
                "weight"
            ) {

                return (
                    Number(
                        b.fishWeight
                    ) -
                    Number(
                        a.fishWeight
                    )
                );
            }


            if (
                selectedSort ===
                "length"
            ) {

                return (
                    Number(
                        b.fishLength
                    ) -
                    Number(
                        a.fishLength
                    )
                );
            }


            if (
                selectedSort ===
                "oldest"
            ) {

                return (
                    new Date(
                        a.fishingDate
                    ) -
                    new Date(
                        b.fishingDate
                    )
                );
            }


            return (
                new Date(
                    b.fishingDate
                ) -
                new Date(
                    a.fishingDate
                )
            );
        }
    );


    // -----------------------------
    // ไม่มีข้อมูล
    // -----------------------------

    if (
        logs.length === 0
    ) {

        logList.innerHTML = `
            <p>
                ยังไม่มีประวัติการตกปลา
            </p>
        `;

        return;
    }


    if (
        filteredLogs.length === 0
    ) {

        logList.innerHTML = `
            <p>
                ไม่พบประวัติที่ค้นหา
            </p>
        `;

        return;
    }


    // -----------------------------
    // แสดง Log
    // -----------------------------

    filteredLogs.forEach(
        function (log) {

            const originalIndex =
                logs.indexOf(log);


            const logItem =
                document.createElement(
                    "div"
                );


            logItem.className =
                "log-item";


            const weight =
                Number(
                    log.fishWeight
                ) || 0;


            const length =
                Number(
                    log.fishLength
                ) || 0;


            logItem.innerHTML = `

                <h3>
                    🐟 ${log.fishName || "ไม่ระบุ"}
                </h3>

                <p>
                    🌊 ประเภท:
                    ${log.fishType || "ไม่ระบุ"}
                </p>

                <p>
                    📍 สถานที่:
                    ${log.location || "ไม่ระบุ"}
                </p>

                <p>
                    📅 วันที่:
                    ${log.fishingDate || "ไม่ระบุ"}
                </p>

                ${weight > 0
                    ? `
                            <p>
                                ⚖️ น้ำหนัก:
                                ${weight} kg
                            </p>
                        `
                    : ""
                }

                ${length > 0
                    ? `
                            <p>
                                📏 ความยาว:
                                ${length} cm
                            </p>
                        `
                    : ""
                }

                ${log.fishNote
                    ? `
                            <p>
                                📝 หมายเหตุ:
                                ${log.fishNote}
                            </p>
                        `
                    : ""
                }

                <div class="log-buttons">

                    <button
                        class="edit-btn"
                        type="button"
                    >
                        ✏️ แก้ไข
                    </button>

                    <button
                        class="delete-btn"
                        type="button"
                    >
                        🗑️ ลบ
                    </button>

                </div>
            `;


            // -----------------------------
            // Edit
            // -----------------------------

            const editButton =
                logItem.querySelector(
                    ".edit-btn"
                );


            if (editButton) {

                editButton.addEventListener(
                    "click",
                    function () {

                        const editForm =
                            document.getElementById(
                                "editForm"
                            );


                        if (!editForm) {
                            return;
                        }


                        const editFishName =
                            document.getElementById(
                                "editFishName"
                            );


                        const editFishType =
                            document.getElementById(
                                "editFishType"
                            );


                        const editLocation =
                            document.getElementById(
                                "editLocation"
                            );


                        const editFishingDate =
                            document.getElementById(
                                "editFishingDate"
                            );


                        const editFishWeight =
                            document.getElementById(
                                "editFishWeight"
                            );


                        const editFishLength =
                            document.getElementById(
                                "editFishLength"
                            );


                        const editFishNote =
                            document.getElementById(
                                "editFishNote"
                            );


                        if (editFishName) {

                            editFishName.value =
                                log.fishName ||
                                "";
                        }


                        if (editFishType) {

                            editFishType.value =
                                log.fishType ||
                                "";
                        }


                        if (editLocation) {

                            editLocation.value =
                                log.location ||
                                "";
                        }


                        if (editFishingDate) {

                            editFishingDate.value =
                                log.fishingDate ||
                                "";
                        }


                        if (editFishWeight) {

                            editFishWeight.value =
                                log.fishWeight ||
                                "";
                        }


                        if (editFishLength) {

                            editFishLength.value =
                                log.fishLength ||
                                "";
                        }


                        if (editFishNote) {

                            editFishNote.value =
                                log.fishNote ||
                                "";
                        }


                        editForm.dataset.index =
                            originalIndex;


                        editForm.style.display =
                            "block";


                        editForm.scrollIntoView({
                            behavior:
                                "smooth"
                        });
                    }
                );
            }


            // -----------------------------
            // Delete
            // -----------------------------

            const deleteButton =
                logItem.querySelector(
                    ".delete-btn"
                );


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    function () {

                        const confirmed =
                            confirm(
                                "ต้องการลบรายการนี้หรือไม่?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        logs.splice(
                            originalIndex,
                            1
                        );


                        localStorage.setItem(
                            "fishingLogs",
                            JSON.stringify(
                                logs
                            )
                        );


                        refreshAll();
                    }
                );
            }


            logList.appendChild(
                logItem
            );
        }
    );
}


// ========================================
// 11. LOG - UPDATE
// ========================================

const updateLog =
    document.getElementById(
        "updateLog"
    );


if (updateLog) {

    updateLog.addEventListener(
        "click",
        function () {

            const editForm =
                document.getElementById(
                    "editForm"
                );


            if (!editForm) {
                return;
            }


            const index =
                Number(
                    editForm.dataset.index
                );


            let logs = [];


            try {

                logs =
                    JSON.parse(
                        localStorage.getItem(
                            "fishingLogs"
                        )
                    ) || [];

            } catch (error) {

                logs = [];
            }


            if (
                index < 0 ||
                index >= logs.length
            ) {

                alert(
                    "ไม่พบข้อมูลที่ต้องการแก้ไข"
                );

                return;
            }


            const editFishName =
                document.getElementById(
                    "editFishName"
                );


            const editFishType =
                document.getElementById(
                    "editFishType"
                );


            const editLocation =
                document.getElementById(
                    "editLocation"
                );


            const editFishingDate =
                document.getElementById(
                    "editFishingDate"
                );


            const editFishWeight =
                document.getElementById(
                    "editFishWeight"
                );


            const editFishLength =
                document.getElementById(
                    "editFishLength"
                );


            const editFishNote =
                document.getElementById(
                    "editFishNote"
                );


            const newFishName =
                editFishName
                    ? editFishName.value.trim()
                    : "";


            const newFishType =
                editFishType
                    ? editFishType.value
                    : "";


            const newLocation =
                editLocation
                    ? editLocation.value.trim()
                    : "";


            const newDate =
                editFishingDate
                    ? editFishingDate.value
                    : "";


            const newWeight =
                editFishWeight
                    ? editFishWeight.value
                    : "";


            const newLength =
                editFishLength
                    ? editFishLength.value
                    : "";


            const newNote =
                editFishNote
                    ? editFishNote.value.trim()
                    : "";


            if (
                newFishName === "" ||
                newFishType === "" ||
                newLocation === "" ||
                newDate === ""
            ) {

                alert(
                    "กรุณากรอกข้อมูลให้ครบ"
                );

                return;
            }


            logs[index].fishName =
                newFishName;


            logs[index].fishType =
                newFishType;


            logs[index].location =
                newLocation;


            logs[index].fishingDate =
                newDate;


            logs[index].fishWeight =
                newWeight;


            logs[index].fishLength =
                newLength;


            logs[index].fishNote =
                newNote;


            localStorage.setItem(
                "fishingLogs",
                JSON.stringify(
                    logs
                )
            );


            alert(
                "แก้ไขข้อมูลเรียบร้อยแล้ว"
            );


            editForm.style.display =
                "none";


            refreshAll();
        }
    );
}


// ========================================
// 12. LOG - CANCEL EDIT
// ========================================

const cancelEdit =
    document.getElementById(
        "cancelEdit"
    );


if (cancelEdit) {

    cancelEdit.addEventListener(
        "click",
        function () {

            const editForm =
                document.getElementById(
                    "editForm"
                );


            if (editForm) {

                editForm.style.display =
                    "none";
            }
        }
    );
}


// ========================================
// 13. LOG SUMMARY
// ========================================

function updateLogSummary() {

    const logTotalCount =
        document.getElementById(
            "logTotalCount"
        );


    const logTotalWeight =
        document.getElementById(
            "logTotalWeight"
        );


    const logLongestFish =
        document.getElementById(
            "logLongestFish"
        );


    if (
        !logTotalCount ||
        !logTotalWeight ||
        !logLongestFish
    ) {

        return;
    }


    let logs = [];


    try {

        logs =
            JSON.parse(
                localStorage.getItem(
                    "fishingLogs"
                )
            ) || [];

    } catch (error) {

        logs = [];
    }


    let totalWeight = 0;

    let longestLength = 0;

    let longestFishName =
        "";


    logs.forEach(
        function (log) {

            const weight =
                Number(
                    log.fishWeight
                ) || 0;


            const length =
                Number(
                    log.fishLength
                ) || 0;


            totalWeight +=
                weight;


            if (
                length >
                longestLength
            ) {

                longestLength =
                    length;

                longestFishName =
                    log.fishName ||
                    "";
            }
        }
    );


    logTotalCount.textContent =
        logs.length;


    logTotalWeight.textContent =
        totalWeight.toFixed(2) +
        " kg";


    if (
        longestLength > 0
    ) {

        logLongestFish.textContent =
            longestFishName +
            " (" +
            longestLength +
            " cm)";

    } else {

        logLongestFish.textContent =
            "ยังไม่มีข้อมูล";
    }
}

// ========================================
// LOG STATISTICS
// ========================================

function updateStats() {

    const totalFish =
        document.getElementById(
            "totalFish"
        );

    const seaFish =
        document.getElementById(
            "seaFish"
        );

    const freshwaterFish =
        document.getElementById(
            "freshwaterFish"
        );


    /*
     * ถ้าไม่ใช่หน้า Log
     * ไม่ต้องทำอะไร
     */

    if (
        !totalFish &&
        !seaFish &&
        !freshwaterFish
    ) {

        return;
    }


    let logs = [];


    try {

        logs =
            JSON.parse(
                localStorage.getItem(
                    "fishingLogs"
                )
            ) || [];

    } catch (error) {

        console.error(
            "ไม่สามารถอ่าน fishingLogs:",
            error
        );

        logs = [];
    }


    let seaCount = 0;

    let freshwaterCount = 0;


    logs.forEach(
        function (log) {

            if (
                log.fishType ===
                "ทะเล"
            ) {

                seaCount++;
            }


            else if (
                log.fishType ===
                "น้ำจืด"
            ) {

                freshwaterCount++;
            }
        }
    );


    // จำนวนปลาทั้งหมด
    if (totalFish) {

        totalFish.textContent =
            logs.length;
    }


    // ปลาทะเล
    if (seaFish) {

        seaFish.textContent =
            seaCount;
    }


    // ปลาน้ำจืด
    if (freshwaterFish) {

        freshwaterFish.textContent =
            freshwaterCount;
    }
}
// ========================================
// 14. DASHBOARD
// ========================================

function updateDashboard() {

    const dashboardTotal =
        document.getElementById(
            "dashboardTotal"
        );


    if (!dashboardTotal) {
        return;
    }


    const dashboardSea =
        document.getElementById(
            "dashboardSea"
        );


    const dashboardFreshwater =
        document.getElementById(
            "dashboardFreshwater"
        );


    const dashboardWeight =
        document.getElementById(
            "dashboardWeight"
        );


    const heaviestFish =
        document.getElementById(
            "heaviestFish"
        );


    const longestFish =
        document.getElementById(
            "longestFish"
        );


    const seaBar =
        document.getElementById(
            "seaBar"
        );


    const freshwaterBar =
        document.getElementById(
            "freshwaterBar"
        );


    const seaBarText =
        document.getElementById(
            "seaBarText"
        );


    const freshwaterBarText =
        document.getElementById(
            "freshwaterBarText"
        );


    const favoriteFish =
        document.getElementById(
            "favoriteFish"
        );


    const topFishList =
        document.getElementById(
            "topFishList"
        );


    let logs = [];


    try {

        logs =
            JSON.parse(
                localStorage.getItem(
                    "fishingLogs"
                )
            ) || [];

    } catch (error) {

        logs = [];
    }


    let seaCount = 0;

    let freshwaterCount = 0;

    let totalWeight = 0;

    let heaviestWeight = 0;

    let heaviestFishName =
        "";

    let longestLength = 0;

    let longestFishName =
        "";


    const fishCountData = {};


    logs.forEach(
        function (log) {

            const name =
                log.fishName ||
                "ไม่ระบุ";


            const type =
                log.fishType ||
                "";


            const weight =
                Number(
                    log.fishWeight
                ) || 0;


            const length =
                Number(
                    log.fishLength
                ) || 0;


            // ประเภท
            if (
                type === "ทะเล"
            ) {

                seaCount++;
            }


            else if (
                type === "น้ำจืด"
            ) {

                freshwaterCount++;
            }


            // น้ำหนักรวม
            totalWeight +=
                weight;


            // หนักที่สุด
            if (
                weight >
                heaviestWeight
            ) {

                heaviestWeight =
                    weight;

                heaviestFishName =
                    name;
            }


            // ยาวที่สุด
            if (
                length >
                longestLength
            ) {

                longestLength =
                    length;

                longestFishName =
                    name;
            }


            // จำนวนปลา
            if (
                fishCountData[name]
            ) {

                fishCountData[name]++;

            } else {

                fishCountData[name] =
                    1;
            }
        }
    );


    // -----------------------------
    // Statistics
    // -----------------------------

    dashboardTotal.textContent =
        logs.length;


    if (dashboardSea) {

        dashboardSea.textContent =
            seaCount;
    }


    if (dashboardFreshwater) {

        dashboardFreshwater.textContent =
            freshwaterCount;
    }


    if (dashboardWeight) {

        dashboardWeight.textContent =
            totalWeight.toFixed(2);
    }


    if (heaviestFish) {

        heaviestFish.textContent =
            heaviestWeight > 0
                ? (
                    heaviestFishName +
                    " (" +
                    heaviestWeight +
                    " kg)"
                )
                : "ยังไม่มีข้อมูล";
    }


    if (longestFish) {

        longestFish.textContent =
            longestLength > 0
                ? (
                    longestFishName +
                    " (" +
                    longestLength +
                    " cm)"
                )
                : "ยังไม่มีข้อมูล";
    }


    // -----------------------------
    // Type Chart
    // -----------------------------

    const maxTypeCount =
        Math.max(
            seaCount,
            freshwaterCount,
            1
        );


    if (seaBar) {

        seaBar.style.width =
            (
                seaCount /
                maxTypeCount *
                100
            ) + "%";
    }


    if (freshwaterBar) {

        freshwaterBar.style.width =
            (
                freshwaterCount /
                maxTypeCount *
                100
            ) + "%";
    }


    if (seaBarText) {

        seaBarText.textContent =
            seaCount;
    }


    if (freshwaterBarText) {

        freshwaterBarText.textContent =
            freshwaterCount;
    }


    // -----------------------------
    // Favorite Fish
    // -----------------------------

    const sortedFish =
        Object.entries(
            fishCountData
        ).sort(
            function (a, b) {

                return (
                    b[1] -
                    a[1]
                );
            }
        );


    if (favoriteFish) {

        if (
            sortedFish.length ===
            0
        ) {

            favoriteFish.textContent =
                "ยังไม่มีข้อมูล";

        } else {

            const favorite =
                sortedFish[0];


            favoriteFish.innerHTML = `
                🐟 ${favorite[0]}
                <br>
                <small>
                    ตกได้ ${favorite[1]} ครั้ง
                </small>
            `;
        }
    }


    // -----------------------------
    // Top 5
    // -----------------------------

    if (topFishList) {

        const topFive =
            sortedFish.slice(
                0,
                5
            );


        if (
            topFive.length ===
            0
        ) {

            topFishList.textContent =
                "ยังไม่มีข้อมูล";

        } else {

            topFishList.innerHTML =
                topFive
                    .map(
                        function (
                            item,
                            index
                        ) {

                            let rankIcon;


                            if (
                                index === 0
                            ) {

                                rankIcon =
                                    "🥇";

                            }

                            else if (
                                index === 1
                            ) {

                                rankIcon =
                                    "🥈";

                            }

                            else if (
                                index === 2
                            ) {

                                rankIcon =
                                    "🥉";

                            }

                            else {

                                rankIcon =
                                    String(
                                        index + 1
                                    );
                            }


                            return `
                                <div
                                    class="top-fish-item"
                                >

                                    <span
                                        class="top-fish-rank"
                                    >
                                        ${rankIcon}
                                    </span>

                                    <span
                                        class="top-fish-name"
                                    >
                                        🐟 ${item[0]}
                                    </span>

                                    <span
                                        class="top-fish-count"
                                    >
                                        ${item[1]} ครั้ง
                                    </span>

                                </div>
                            `;
                        }
                    )
                    .join("");
        }
    }
}


// ========================================
// 15. WEIGHT CHART
// ========================================

function updateWeightChart() {

    const weightChart =
        document.getElementById(
            "weightChart"
        );


    if (!weightChart) {
        return;
    }


    let logs = [];


    try {

        logs =
            JSON.parse(
                localStorage.getItem(
                    "fishingLogs"
                )
            ) || [];

    } catch (error) {

        logs = [];
    }


    const weightLogs =
        logs.filter(
            function (log) {

                return (
                    Number(
                        log.fishWeight
                    ) > 0
                );
            }
        );


    if (
        weightLogs.length ===
        0
    ) {

        weightChart.textContent =
            "ยังไม่มีข้อมูล";

        return;
    }


    let maxWeight = 0;


    weightLogs.forEach(
        function (log) {

            const weight =
                Number(
                    log.fishWeight
                ) || 0;


            if (
                weight >
                maxWeight
            ) {

                maxWeight =
                    weight;
            }
        }
    );


    weightChart.innerHTML =
        weightLogs
            .map(
                function (log) {

                    const name =
                        log.fishName ||
                        "ไม่ระบุ";


                    const weight =
                        Number(
                            log.fishWeight
                        ) || 0;


                    const percentage =
                        maxWeight > 0
                            ? (
                                weight /
                                maxWeight *
                                100
                            )
                            : 0;


                    return `
                        <div
                            class="weight-chart-row"
                        >

                            <div
                                class="weight-chart-name"
                                title="${name}"
                            >
                                🐟 ${name}
                            </div>

                            <div
                                class="weight-chart-background"
                            >

                                <div
                                    class="weight-chart-bar"
                                    style="width:${percentage}%"
                                ></div>

                            </div>

                            <div
                                class="weight-chart-value"
                            >
                                ${weight} kg
                            </div>

                        </div>
                    `;
                }
            )
            .join("");
}


// ========================================
// 16. FISH COUNT CHART
// ========================================

function updateFishCountChart() {

    const fishCountChart =
        document.getElementById(
            "fishCountChart"
        );


    if (!fishCountChart) {
        return;
    }


    let logs = [];


    try {

        logs =
            JSON.parse(
                localStorage.getItem(
                    "fishingLogs"
                )
            ) || [];

    } catch (error) {

        logs = [];
    }


    if (
        logs.length ===
        0
    ) {

        fishCountChart.textContent =
            "ยังไม่มีข้อมูล";

        return;
    }


    const fishCount = {};


    logs.forEach(
        function (log) {

            const name =
                log.fishName ||
                "ไม่ระบุ";


            if (
                fishCount[name]
            ) {

                fishCount[name]++;

            } else {

                fishCount[name] =
                    1;
            }
        }
    );


    const sortedFish =
        Object.entries(
            fishCount
        ).sort(
            function (a, b) {

                return (
                    b[1] -
                    a[1]
                );
            }
        );


    const maxCount =
        sortedFish.length > 0
            ? sortedFish[0][1]
            : 1;


    fishCountChart.innerHTML =
        sortedFish
            .map(
                function (item) {

                    const name =
                        item[0];


                    const count =
                        item[1];


                    const percentage =
                        (
                            count /
                            maxCount *
                            100
                        );


                    return `
                        <div
                            class="fish-count-chart-row"
                        >

                            <div
                                class="fish-count-chart-name"
                                title="${name}"
                            >
                                🐟 ${name}
                            </div>

                            <div
                                class="fish-count-chart-background"
                            >

                                <div
                                    class="fish-count-chart-bar"
                                    style="width:${percentage}%"
                                ></div>

                            </div>

                            <div
                                class="fish-count-chart-value"
                            >
                                ${count} ครั้ง
                            </div>

                        </div>
                    `;
                }
            )
            .join("");
}


// ========================================
// 17. FISHING SUMMARY
// ========================================

function updateFishingSummary() {

    const fishingSummary =
        document.getElementById(
            "fishingSummary"
        );


    if (!fishingSummary) {
        return;
    }


    let logs = [];


    try {

        logs =
            JSON.parse(
                localStorage.getItem(
                    "fishingLogs"
                )
            ) || [];

    } catch (error) {

        logs = [];
    }


    if (
        logs.length ===
        0
    ) {

        fishingSummary.innerHTML = `
            <div
                class="fishing-summary-line"
            >
                ยังไม่มีข้อมูลการตกปลา
            </div>
        `;

        return;
    }


    let totalWeight = 0;

    let heaviestWeight = 0;

    let heaviestFishName =
        "";


    const fishCount = {};


    logs.forEach(
        function (log) {

            const name =
                log.fishName ||
                "ไม่ระบุ";


            const weight =
                Number(
                    log.fishWeight
                ) || 0;


            totalWeight +=
                weight;


            if (
                weight >
                heaviestWeight
            ) {

                heaviestWeight =
                    weight;

                heaviestFishName =
                    name;
            }


            if (
                fishCount[name]
            ) {

                fishCount[name]++;

            } else {

                fishCount[name] =
                    1;
            }
        }
    );


    const sortedFish =
        Object.entries(
            fishCount
        ).sort(
            function (a, b) {

                return (
                    b[1] -
                    a[1]
                );
            }
        );


    const favoriteName =
        sortedFish.length > 0
            ? sortedFish[0][0]
            : "";


    const favoriteCount =
        sortedFish.length > 0
            ? sortedFish[0][1]
            : 0;


    fishingSummary.innerHTML = `

        <div
            class="fishing-summary-line"
        >
            คุณบันทึกการตกปลาแล้ว
            <strong>
                ${logs.length} ครั้ง
            </strong>
        </div>

        <div
            class="fishing-summary-line"
        >
            🐟 ปลาที่ตกบ่อยที่สุด:
            <strong>
                ${favoriteName}
            </strong>
            (${favoriteCount} ครั้ง)
        </div>

        <div
            class="fishing-summary-line"
        >
            ⚖️ น้ำหนักรวม:
            <strong>
                ${totalWeight.toFixed(2)} kg
            </strong>
        </div>

        <div
            class="fishing-summary-line"
        >
            🏆 ปลาที่หนักที่สุด:
            <strong>
                ${heaviestWeight > 0
            ? (
                heaviestFishName +
                " (" +
                heaviestWeight +
                " kg)"
            )
            : "ยังไม่มีข้อมูล"
        }
            </strong>
        </div>

    `;
}

// ========================================
// 18. MONTHLY SUMMARY
// ========================================

// ========================================
// MONTHLY SUMMARY
// ========================================

function updateMonthlySummary() {

    const monthlySummary =
        document.getElementById(
            "monthlySummary"
        );


    const monthSelect =
        document.getElementById(
            "monthSelect"
        );


    if (!monthlySummary) {
        return;
    }


    let logs = [];


    try {

        logs =
            JSON.parse(
                localStorage.getItem(
                    "fishingLogs"
                )
            ) || [];

    } catch (error) {

        console.error(
            "ไม่สามารถอ่าน fishingLogs:",
            error
        );

        logs = [];
    }


    // ไม่มีข้อมูล
    if (logs.length === 0) {

        if (monthSelect) {

            monthSelect.innerHTML = `
                <option value="">
                    ไม่มีข้อมูล
                </option>
            `;
        }


        monthlySummary.innerHTML = `
            <div class="monthly-summary-title">
                ยังไม่มีข้อมูล
            </div>
        `;

        return;
    }


    // ========================================
    // สร้างรายการเดือนที่มีข้อมูล
    // ========================================

    const monthData = {};


    logs.forEach(
        function (log) {

            if (!log.fishingDate) {
                return;
            }


            const date =
                new Date(
                    log.fishingDate
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return;
            }


            const year =
                date.getFullYear();


            const month =
                String(
                    date.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const key =
                year + "-" + month;


            if (!monthData[key]) {

                monthData[key] = {

                    year:
                        year,

                    month:
                        date.getMonth(),

                    logs: []
                };
            }


            monthData[key].logs.push(
                log
            );
        }
    );


    const monthKeys =
        Object.keys(
            monthData
        ).sort(
            function (a, b) {

                return (
                    b.localeCompare(a)
                );
            }
        );


    // ========================================
    // สร้าง Dropdown
    // ========================================

    if (monthSelect) {

        const currentValue =
            monthSelect.value;


        monthSelect.innerHTML =
            monthKeys
                .map(
                    function (key) {

                        const year =
                            monthData[key].year;


                        const month =
                            monthData[key].month;


                        const monthNames = [

                            "มกราคม",
                            "กุมภาพันธ์",
                            "มีนาคม",
                            "เมษายน",
                            "พฤษภาคม",
                            "มิถุนายน",
                            "กรกฎาคม",
                            "สิงหาคม",
                            "กันยายน",
                            "ตุลาคม",
                            "พฤศจิกายน",
                            "ธันวาคม"

                        ];


                        return `
                            <option
                                value="${key}"
                            >
                                ${monthNames[month]}
                                ${year}
                            </option>
                        `;
                    }
                )
                .join("");


        // เลือกค่าก่อนหน้า
        if (
            currentValue &&
            monthKeys.includes(
                currentValue
            )
        ) {

            monthSelect.value =
                currentValue;

        }

        else {

            // เลือกเดือนล่าสุด
            monthSelect.value =
                monthKeys[0];
        }
    }


    // ========================================
    // เดือนที่ต้องการแสดง
    // ========================================

    const selectedMonth =
        monthSelect
            ? monthSelect.value
            : monthKeys[0];


    const selectedData =
        monthData[selectedMonth];


    if (!selectedData) {

        monthlySummary.innerHTML = `
            <div class="monthly-summary-title">
                ไม่พบข้อมูล
            </div>
        `;

        return;
    }


    const selectedLogs =
        selectedData.logs;


    // ========================================
    // ชื่อเดือน
    // ========================================

    const monthNames = [

        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม"

    ];


    const monthTitle =
        monthNames[
        selectedData.month
        ] +
        " " +
        selectedData.year;


    // ========================================
    // คำนวณข้อมูล
    // ========================================

    let totalWeight = 0;


    const fishCount = {};


    selectedLogs.forEach(
        function (log) {

            const weight =
                Number(
                    log.fishWeight
                ) || 0;


            totalWeight +=
                weight;


            const fishName =
                log.fishName ||
                "ไม่ระบุ";


            if (
                fishCount[fishName]
            ) {

                fishCount[fishName]++;

            }

            else {

                fishCount[fishName] =
                    1;
            }
        }
    );


    // ========================================
    // ปลาที่ตกบ่อยที่สุด
    // ========================================

    const sortedFish =
        Object.entries(
            fishCount
        )
            .sort(
                function (a, b) {

                    return (
                        b[1] -
                        a[1]
                    );
                }
            );


    let favoriteFish =
        "ยังไม่มีข้อมูล";


    if (
        sortedFish.length > 0
    ) {

        favoriteFish =
            sortedFish[0][0];
    }


    // ========================================
    // แสดงผล
    // ========================================

    monthlySummary.innerHTML = `

        <div
            class="monthly-summary-title"
        >
            ${monthTitle}
        </div>


        <div
            class="monthly-summary-grid"
        >

            <div
                class="monthly-summary-item"
            >

                <div
                    class="monthly-summary-icon"
                >
                    🐟
                </div>

                <div
                    class="monthly-summary-value"
                >
                    ${selectedLogs.length}
                </div>

                <div
                    class="monthly-summary-label"
                >
                    ครั้งที่ตกปลา
                </div>

            </div>


            <div
                class="monthly-summary-item"
            >

                <div
                    class="monthly-summary-icon"
                >
                    ⚖️
                </div>

                <div
                    class="monthly-summary-value"
                >
                    ${totalWeight.toFixed(2)}
                    kg
                </div>

                <div
                    class="monthly-summary-label"
                >
                    น้ำหนักรวม
                </div>

            </div>


            <div
                class="monthly-summary-item"
            >

                <div
                    class="monthly-summary-icon"
                >
                    🏆
                </div>

                <div
                    class="monthly-summary-value"
                >
                    ${favoriteFish}
                </div>

                <div
                    class="monthly-summary-label"
                >
                    ปลาที่ตกบ่อยที่สุด
                </div>

            </div>

        </div>

    `;
}
// ========================================
// เปลี่ยนเดือน
// ========================================

const monthSelect =
    document.getElementById(
        "monthSelect"
    );


if (monthSelect) {

    monthSelect.addEventListener(
        "change",
        function () {

            updateMonthlySummary();

        }
    );
}
// ========================================
// 18. DAILY FISHING CHART
// ========================================

function updateDailyFishingChart() {

    const dailyFishingChart =
        document.getElementById(
            "dailyFishingChart"
        );


    if (!dailyFishingChart) {
        return;
    }


    let logs = [];


    try {

        logs =
            JSON.parse(
                localStorage.getItem(
                    "fishingLogs"
                )
            ) || [];

    } catch (error) {

        logs = [];
    }


    if (
        logs.length ===
        0
    ) {

        dailyFishingChart.textContent =
            "ยังไม่มีข้อมูล";

        return;
    }


    const dailyCount = {};


    logs.forEach(
        function (log) {

            const date =
                log.fishingDate;


            if (!date) {
                return;
            }


            if (
                dailyCount[date]
            ) {

                dailyCount[date]++;

            } else {

                dailyCount[date] =
                    1;
            }
        }
    );


    const sortedDays =
        Object.entries(
            dailyCount
        ).sort(
            function (a, b) {

                return (
                    new Date(b[0]) -
                    new Date(a[0])
                );
            }
        );


    if (
        sortedDays.length ===
        0
    ) {

        dailyFishingChart.textContent =
            "ยังไม่มีข้อมูลวันที่";

        return;
    }


    const maxCount =
        Math.max(
            ...sortedDays.map(
                function (item) {

                    return item[1];
                }
            )
        );


    dailyFishingChart.innerHTML =
        sortedDays
            .map(
                function (item) {

                    const date =
                        item[0];


                    const count =
                        item[1];


                    const percentage =
                        (
                            count /
                            maxCount *
                            100
                        );


                    return `
                        <div
                            class="daily-fishing-row"
                        >

                            <div
                                class="daily-fishing-date"
                            >
                                📅 ${date}
                            </div>

                            <div
                                class="daily-fishing-background"
                            >

                                <div
                                    class="daily-fishing-bar"
                                    style="width:${percentage}%"
                                ></div>

                            </div>

                            <div
                                class="daily-fishing-count"
                            >
                                ${count} ครั้ง
                            </div>

                        </div>
                    `;
                }
            )
            .join("");
}


// ========================================
// 19. DARK MODE
// ========================================

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


const savedTheme =
    localStorage.getItem(
        "fishFinderTheme"
    );


if (
    savedTheme ===
    "dark"
) {

    document.body.classList.add(
        "dark-mode"
    );
}


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );


            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );


            if (isDark) {

                localStorage.setItem(
                    "fishFinderTheme",
                    "dark"
                );


                themeToggle.textContent =
                    "☀️";

            } else {

                localStorage.setItem(
                    "fishFinderTheme",
                    "light"
                );


                themeToggle.textContent =
                    "🌙";
            }
        }
    );
}


if (
    themeToggle &&
    document.body.classList.contains(
        "dark-mode"
    )
) {

    themeToggle.textContent =
        "☀️";
}


// ========================================
// 20. GRID / LIST VIEW
// ========================================

const fishListView =
    document.getElementById(
        "fishList"
    );


const gridViewButton =
    document.getElementById(
        "gridViewButton"
    );


const listViewButton =
    document.getElementById(
        "listViewButton"
    );


const savedView =
    localStorage.getItem(
        "fishFinderView"
    );


function setFishView(view) {

    if (!fishListView) {
        return;
    }


    if (
        view === "list"
    ) {

        fishListView.classList.add(
            "list-view"
        );


        if (listViewButton) {

            listViewButton.classList.add(
                "active"
            );
        }


        if (gridViewButton) {

            gridViewButton.classList.remove(
                "active"
            );
        }

    } else {

        fishListView.classList.remove(
            "list-view"
        );


        if (gridViewButton) {

            gridViewButton.classList.add(
                "active"
            );
        }


        if (listViewButton) {

            listViewButton.classList.remove(
                "active"
            );
        }
    }


    localStorage.setItem(
        "fishFinderView",
        view
    );
}


// Grid
if (gridViewButton) {

    gridViewButton.addEventListener(
        "click",
        function () {

            setFishView(
                "grid"
            );
        }
    );
}


// List
if (listViewButton) {

    listViewButton.addEventListener(
        "click",
        function () {

            setFishView(
                "list"
            );
        }
    );
}


// โหลดรูปแบบที่บันทึกไว้
if (
    savedView ===
    "list"
) {

    setFishView(
        "list"
    );

}

else {

    setFishView(
        "grid"
    );
}


// ========================================
// 21. REFRESH ALL
// ========================================

function refreshAll() {

    showLogs();

    updateStats();

    updateDashboard();

    updateLogSummary();

    updateWeightChart();

    updateFishCountChart();

    updateFishingSummary();

    updateDailyFishingChart();

    updateMonthlySummary();
}


// ========================================
// 22. INITIAL LOAD
// ========================================

window.addEventListener(
    "DOMContentLoaded",
    function () {

        refreshAll();

    }
);


// ========================================
// END OF MAIN.JS
// ========================================