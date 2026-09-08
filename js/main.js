// ========================================
// FishFinder - main.js
// ========================================


// ========================================
// 1. ระบบค้นหาปลา
// ========================================

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");


if (searchButton) {

    searchButton.addEventListener(
        "click",
        function () {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (keyword === "") {

                window.location.href =
                    "fish.html";

                return;

            }


            window.location.href =
                "fish.html?search=" +
                encodeURIComponent(keyword);

        }
    );

}


// ========================================
// 2. ระบบค้นหาใน Fish Guide
// ========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const searchKeyword =
    params.get("search");


if (searchKeyword) {

    const fishCards =
        document.querySelectorAll(
            ".fish-card"
        );


    const noResult =
        document.getElementById(
            "noResult"
        );


    let found = false;


    fishCards.forEach(
        function (card) {

            const fishName =
                card.dataset.name
                    .toLowerCase();


            const fishType =
                card.dataset.type
                    .toLowerCase();


            if (
                fishName.includes(
                    searchKeyword
                ) ||
                fishType.includes(
                    searchKeyword
                )
            ) {

                card.style.display =
                    "block";

                found = true;

            }

            else {

                card.style.display =
                    "none";

            }

        }
    );


    if (noResult) {

        noResult.style.display =
            found
                ? "none"
                : "block";

    }

}


// ========================================
// 3. ระบบกรองประเภทปลา
// ========================================

const fishTypeFilter =
    document.getElementById(
        "fishType"
    );


if (
    fishTypeFilter &&
    document.querySelector(".fish-card")
) {

    fishTypeFilter.addEventListener(
        "change",
        function () {

            const selectedType =
                fishTypeFilter.value;


            const fishCards =
                document.querySelectorAll(
                    ".fish-card"
                );


            const noResult =
                document.getElementById(
                    "noResult"
                );


            let found = false;


            fishCards.forEach(
                function (card) {

                    const cardType =
                        card.dataset.type;


                    const matchesType =
                        selectedType === "all" ||
                        cardType === selectedType;


                    const matchesSearch =
                        !searchKeyword ||
                        card.dataset.name
                            .toLowerCase()
                            .includes(
                                searchKeyword
                            ) ||
                        card.dataset.type
                            .toLowerCase()
                            .includes(
                                searchKeyword
                            );


                    if (
                        matchesType &&
                        matchesSearch
                    ) {

                        card.style.display =
                            "block";

                        found = true;

                    }

                    else {

                        card.style.display =
                            "none";

                    }

                }
            );


            if (noResult) {

                noResult.style.display =
                    found
                        ? "none"
                        : "block";

            }

        }
    );

}


// ========================================
// 4. ระบบบันทึกการตกปลา
// ========================================

const saveLog =
    document.getElementById(
        "saveLog"
    );


if (saveLog) {

    saveLog.addEventListener(
        "click",
        function () {


            const fishName =
                document
                    .getElementById(
                        "fishName"
                    )
                    .value
                    .trim();


            const fishType =
                document
                    .getElementById(
                        "fishType"
                    )
                    .value;


            const location =
                document
                    .getElementById(
                        "location"
                    )
                    .value
                    .trim();


            const fishingDate =
                document
                    .getElementById(
                        "fishingDate"
                    )
                    .value;


            // ตรวจสอบข้อมูล
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


            // สร้างข้อมูล
            const log = {

                fishName:
                    fishName,

                fishType:
                    fishType,

                location:
                    location,

                fishingDate:
                    fishingDate

            };


            // ดึงข้อมูลเดิม
            let logs =
                JSON.parse(
                    localStorage.getItem(
                        "fishingLogs"
                    )
                ) || [];


            // เพิ่มข้อมูล
            logs.push(log);


            // บันทึก
            localStorage.setItem(
                "fishingLogs",
                JSON.stringify(logs)
            );


            alert(
                "บันทึกข้อมูลเรียบร้อยแล้ว"
            );


            // ล้างช่องกรอก
            document.getElementById(
                "fishName"
            ).value = "";


            document.getElementById(
                "fishType"
            ).value = "";


            document.getElementById(
                "location"
            ).value = "";


            document.getElementById(
                "fishingDate"
            ).value = "";


            showLogs();

            updateStats();

        }
    );

}


// ========================================
// 5. แสดงประวัติการตกปลา
// ========================================

function showLogs() {

    const logList =
        document.getElementById(
            "logList"
        );


    if (!logList) {

        return;

    }


    const logs =
        JSON.parse(
            localStorage.getItem(
                "fishingLogs"
            )
        ) || [];


    logList.innerHTML = "";


    // ถ้าไม่มีข้อมูล
    if (logs.length === 0) {

        logList.innerHTML = `
            <p>
                ยังไม่มีประวัติการตกปลา
            </p>
        `;

        return;

    }


    // แสดงข้อมูล
    logs.forEach(
        function (log) {

            const logItem =
                document.createElement(
                    "div"
                );


            logItem.className =
                "log-item";


            const typeText =
                log.fishType ||
                "ไม่ระบุ";


            logItem.innerHTML = `

                <h3>
                    🐟 ${log.fishName}
                </h3>

                <p>
                    🌊 ประเภท:
                    ${typeText}
                </p>

                <p>
                    📍 สถานที่:
                    ${log.location}
                </p>

                <p>
                    📅 วันที่:
                    ${log.fishingDate}
                </p>

                <button class="edit-btn">
                    ✏️ แก้ไข
                </button>

                <button class="delete-btn">
                    🗑️ ลบ
                </button>

            `;


            // ========================================
            // ปุ่มแก้ไข
            // ========================================

            const editButton =
                logItem.querySelector(
                    ".edit-btn"
                );


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


                    document.getElementById(
                        "editFishName"
                    ).value =
                        log.fishName;


                    document.getElementById(
                        "editFishType"
                    ).value =
                        log.fishType || "";


                    document.getElementById(
                        "editLocation"
                    ).value =
                        log.location;


                    document.getElementById(
                        "editFishingDate"
                    ).value =
                        log.fishingDate;


                    editForm.style.display =
                        "block";


                    editForm.dataset.index =
                        logs.indexOf(log);


                    editForm.scrollIntoView({
                        behavior: "smooth"
                    });

                }
            );


            // ========================================
            // ปุ่มลบ
            // ========================================

            const deleteButton =
                logItem.querySelector(
                    ".delete-btn"
                );


            deleteButton.addEventListener(
                "click",
                function () {


                    const confirmDelete =
                        confirm(
                            "ต้องการลบรายการนี้หรือไม่?"
                        );


                    if (!confirmDelete) {

                        return;

                    }


                    const index =
                        logs.indexOf(log);


                    logs.splice(
                        index,
                        1
                    );


                    localStorage.setItem(
                        "fishingLogs",
                        JSON.stringify(logs)
                    );


                    showLogs();

                    updateStats();

                }
            );


            logList.appendChild(
                logItem
            );

        }
    );

}


// ========================================
// 6. ระบบสถิติ
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


    if (!totalFish) {

        return;

    }


    const logs =
        JSON.parse(
            localStorage.getItem(
                "fishingLogs"
            )
        ) || [];


    totalFish.textContent =
        logs.length;


    let seaCount = 0;

    let freshwaterCount = 0;


    logs.forEach(
        function (log) {

            if (
                log.fishType === "ทะเล"
            ) {

                seaCount++;

            }

            else if (
                log.fishType === "น้ำจืด"
            ) {

                freshwaterCount++;

            }

        }
    );


    seaFish.textContent =
        seaCount;


    freshwaterFish.textContent =
        freshwaterCount;

}


// ========================================
// 7. บันทึกการแก้ไข
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


            const index =
                Number(
                    editForm.dataset.index
                );


            const newFishName =
                document
                    .getElementById(
                        "editFishName"
                    )
                    .value
                    .trim();


            const newFishType =
                document
                    .getElementById(
                        "editFishType"
                    )
                    .value;


            const newLocation =
                document
                    .getElementById(
                        "editLocation"
                    )
                    .value
                    .trim();


            const newDate =
                document
                    .getElementById(
                        "editFishingDate"
                    )
                    .value;


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


            const logs =
                JSON.parse(
                    localStorage.getItem(
                        "fishingLogs"
                    )
                ) || [];


            if (
                index < 0 ||
                index >= logs.length
            ) {

                alert(
                    "ไม่พบข้อมูลที่ต้องการแก้ไข"
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


            localStorage.setItem(
                "fishingLogs",
                JSON.stringify(logs)
            );


            alert(
                "แก้ไขข้อมูลเรียบร้อยแล้ว"
            );


            editForm.style.display =
                "none";


            showLogs();

            updateStats();

        }
    );

}


// ========================================
// 8. ยกเลิกการแก้ไข
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
// 9. Dashboard
// ========================================

function updateDashboard() {

    const dashboardTotal =
        document.getElementById(
            "dashboardTotal"
        );


    const dashboardSea =
        document.getElementById(
            "dashboardSea"
        );


    const dashboardFreshwater =
        document.getElementById(
            "dashboardFreshwater"
        );


    if (!dashboardTotal) {

        return;

    }


    const logs =
        JSON.parse(
            localStorage.getItem(
                "fishingLogs"
            )
        ) || [];


    dashboardTotal.textContent =
        logs.length;


    let seaCount = 0;

    let freshwaterCount = 0;


    const fishCount = {};


    logs.forEach(
        function (log) {


            if (
                log.fishType === "ทะเล"
            ) {

                seaCount++;

            }

            else if (
                log.fishType === "น้ำจืด"
            ) {

                freshwaterCount++;

            }


            // นับชื่อปลา
            if (
                fishCount[log.fishName]
            ) {

                fishCount[log.fishName]++;

            }

            else {

                fishCount[log.fishName] = 1;

            }

        }
    );


    dashboardSea.textContent =
        seaCount;


    dashboardFreshwater.textContent =
        freshwaterCount;


    // ========================================
    // กราฟ
    // ========================================

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


    const maxCount =
        Math.max(
            seaCount,
            freshwaterCount,
            1
        );


    if (seaBar) {

        seaBar.style.width =
            (
                seaCount /
                maxCount *
                100
            ) + "%";

    }


    if (freshwaterBar) {

        freshwaterBar.style.width =
            (
                freshwaterCount /
                maxCount *
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


    // ========================================
    // ปลาที่ตกบ่อยที่สุด
    // ========================================

    const favoriteFish =
        document.getElementById(
            "favoriteFish"
        );


    if (!favoriteFish) {

        return;

    }


    if (logs.length === 0) {

        favoriteFish.textContent =
            "ยังไม่มีข้อมูล";

        return;

    }


    let mostCaughtFish = "";

    let highestCount = 0;


    for (
        const fish in fishCount
    ) {

        if (
            fishCount[fish] >
            highestCount
        ) {

            highestCount =
                fishCount[fish];

            mostCaughtFish =
                fish;

        }

    }


    favoriteFish.innerHTML = `

        🐟 ${mostCaughtFish}

        <br>

        <small>
            ตกได้ ${highestCount} ครั้ง
        </small>

    `;

}


// ========================================
// 10. Fish Modal
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


    const fishCards =
        document.querySelectorAll(
            ".fish-card"
        );


    // ========================================
    // คลิกการ์ดปลา
    // ========================================

    fishCards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {


                    const name =
                        card.dataset.name;


                    const type =
                        card.dataset.type;


                    const bait =
                        card.dataset.bait;


                    const time =
                        card.dataset.time;


                    const image =
                        card.querySelector(
                            "img"
                        ).src;


                    // แสดงข้อมูล
                    modalImage.src =
                        image;


                    modalImage.alt =
                        name;


                    modalName.textContent =
                        "🐟 " + name;


                    modalType.textContent =
                        "🌊 ประเภท: " +
                        type;


                    modalBait.textContent =
                        "🎣 เหยื่อที่แนะนำ: " +
                        bait;


                    modalTime.textContent =
                        "⏰ ช่วงเวลาที่เหมาะ: " +
                        time;


                    // เก็บข้อมูลปลา
                    if (saveFishButton) {

                        saveFishButton.dataset.name =
                            name;

                        saveFishButton.dataset.type =
                            type;

                    }


                    // เปิด Modal
                    fishModal.style.display =
                        "flex";

                }
            );

        }
    );


    // ========================================
    // ปุ่ม X
    // ========================================

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            function () {

                fishModal.style.display =
                    "none";

            }
        );

    }


    // ========================================
    // ปุ่มปิด
    // ========================================

    if (modalCloseButton) {

        modalCloseButton.addEventListener(
            "click",
            function () {

                fishModal.style.display =
                    "none";

            }
        );

    }


    // ========================================
    // คลิกพื้นหลัง
    // ========================================

    fishModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === fishModal
            ) {

                fishModal.style.display =
                    "none";

            }

        }
    );


    // ========================================
    // บันทึกปลาตัวนี้
    // ========================================

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
                    encodeURIComponent(name) +
                    "&type=" +
                    encodeURIComponent(type);

            }
        );

    }

}


// ========================================
// 11. รับข้อมูลจาก Fish Guide
// ========================================

const guideParams =
    new URLSearchParams(
        window.location.search
    );


const fishFromGuide =
    guideParams.get("fish");


const typeFromGuide =
    guideParams.get("type");


if (
    fishFromGuide &&
    document.getElementById("fishName")
) {

    document.getElementById(
        "fishName"
    ).value =
        fishFromGuide;


    document.getElementById(
        "fishType"
    ).value =
        typeFromGuide || "";

}


// ========================================
// 12. โหลดระบบทั้งหมด
// ========================================

showLogs();

updateStats();

updateDashboard();