<script>
export default {
    props: { idx: { type: Number, required: true } },
}
</script>

<template>
    <div class="popup-overlay">
        <div class="popup-box">
            <!-- <button type="button" class="close-btn" @click.self="$emit('close')">❌</button> -->
            <!-- test if key is passed -->
            <!-- <div>idx = {{ idx }}</div> -->
            <div class="modal-header">
                <button type="button" class="btn-close" @click.self="$emit('close')" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <!-- Different content depending on idx -->
            <template v-if="idx === 0">
                <h2>🍳 My Recipes — Full Feature Overview</h2>
                <p>Here you can find, save, and rediscover recipes that fit your ingredients.</p>
                <ul>
                    <li>Discover: Smart recommendations</li>
                    <li>Saved: Favorite recipes anytime</li>
                    <li>History: View recently tried meals</li>
                </ul>
            </template>

            <template v-else-if="idx === 1">
                <h2>🧊 My Fridge — Smart Ingredient Tracker</h2>
                <p>Manage your groceries, auto-categorize by type, and get alerts for expiring items.</p>
            </template>

            <template v-else-if="idx === 2">
                <h2>📋 Kitchen Dashboard — Waste Awareness</h2>
                <p>See what expired and what's about to expire. Learn how to shop smarter and reduce waste.</p>
            </template>
        </div>
    </div>
</template>

<style scoped>
/* .close-btn {
    position: relative;
    top: 0;
    right: 0;
} */

.btn-close {
    margin: 0px 0 10px auto ;
    top: 0;
    right: 0;
}

.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.popup-box {
    background: white;
    border-radius: 20px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
    from {
        transform: scale(0.95);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
