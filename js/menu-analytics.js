/*
 * FishFinder - Menu Analytics
 * เก็บการกดเมนูข้ามการเปลี่ยนหน้า
 */
(function () {
    "use strict";

    var STORAGE_KEY = "fishFinder_pending_menu_click";

    function getPageName(href) {
        try {
            var url = new URL(href, window.location.href);
            return url.pathname.split("/").pop() || "index.html";
        } catch (error) {
            return href || "";
        }
    }

    function sendPendingMenuClick() {
        if (typeof trackEvent !== "function") {
            return;
        }

        var raw = null;

        try {
            raw = sessionStorage.getItem(STORAGE_KEY);
        } catch (error) {
            return;
        }

        if (!raw) {
            return;
        }

        var data;

        try {
            data = JSON.parse(raw);
        } catch (error) {
            try {
                sessionStorage.removeItem(STORAGE_KEY);
            } catch (ignore) {}
            return;
        }

        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (error) {}

        try {
            var result = trackEvent("menu_click", data);

            if (result && typeof result.catch === "function") {
                result.catch(function (error) {
                    console.warn("ส่ง menu_click ไม่สำเร็จ:", error);
                });
            }
        } catch (error) {
            console.warn("ส่ง menu_click ไม่สำเร็จ:", error);
        }
    }

    function bindMenuClick() {
        document.addEventListener("click", function (event) {
            var link = event.target.closest("header nav a");

            if (!link) {
                return;
            }

            if (
                event.button !== 0 ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            var href = link.getAttribute("href");

            if (!href || href === "#") {
                return;
            }

            var targetUrl;
            var currentUrl;

            try {
                targetUrl = new URL(href, window.location.href);
                currentUrl = new URL(window.location.href);
            } catch (error) {
                return;
            }

            if (targetUrl.origin !== currentUrl.origin) {
                return;
            }

            if (
                targetUrl.pathname === currentUrl.pathname &&
                targetUrl.hash
            ) {
                return;
            }

            var menuText = (link.textContent || "")
                .trim()
                .replace(/\s+/g, " ");

            var data = {
                menu_text: menuText,
                target_page: getPageName(targetUrl.href),
                target_url: targetUrl.href
            };

            try {
                sessionStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(data)
                );
            } catch (error) {
                console.warn("บันทึก menu_click ชั่วคราวไม่สำเร็จ:", error);
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            sendPendingMenuClick();
            bindMenuClick();
        });
    } else {
        sendPendingMenuClick();
        bindMenuClick();
    }
})();
