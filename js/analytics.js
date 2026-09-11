// ========================================
// FishFinder Analytics
// เก็บสถิติการใช้งานลง Supabase
// ========================================

async function trackEvent(eventName, pageName = null, eventData = {}) {
    try {
        // ตรวจว่ามี Supabase client หรือไม่
        if (!window.supabaseClient) {
            console.warn("ยังไม่ได้เชื่อม Supabase");
            return;
        }

        // ตรวจว่าผู้ใช้ Login อยู่หรือไม่
        const {
            data: { user }
        } = await window.supabaseClient.auth.getUser();

        // ตอนนี้เก็บเฉพาะผู้ใช้ที่ Login แล้ว
        if (!user) {
            return;
        }

        const { error } =
            await window.supabaseClient
                .from("analytics_events")
                .insert({
                    user_id: user.id,
                    event_name: eventName,
                    page_name: pageName || location.pathname,
                    event_data: eventData
                });

        if (error) {
            console.error("บันทึก Analytics ไม่สำเร็จ:", error);
        }
    } catch (error) {
        console.error("Analytics Error:", error);
    }
}


// ========================================
// เปิดหน้าเว็บ
// ========================================

document.addEventListener("DOMContentLoaded", function () {
    trackEvent(
        "page_view",
        location.pathname,
        {
            title: document.title
        }
    );
});