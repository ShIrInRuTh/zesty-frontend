<template>
  <section class="section">
    <div class="section-title">🍑 Your Cooking History</div>
    <div class="history-card-stack">
      <transition-group name="slide-fade" tag="div">
        <div v-for="item in lookBack" :key="item.title" class="wide-peach-card">
          <div class="wide-card-content">
            <div class="wide-img-wrap">
              <img :src="item.image" :alt="item.title" class="wide-card-img" />
            </div>
            <div class="wide-details">
              <div class="wide-title">{{ item.title }}</div>
              <div class="wide-meta-row">
                <span class="wide-meta" v-for="m in item.meta" :key="m.text">
                  <span class="icon">{{ m.icon }}</span> {{ m.text }}
                </span>
              </div>
              <div class="wide-rating">
                <span class="icon">⭐</span> {{ item.rating }}
                <span class="tried-on">• Tried on {{ item.triedOn }}</span>
              </div>
            </div>
            <button class="wide-try-btn">Try Again</button>
          </div>
        </div>
      </transition-group>
    </div>
  </section>
</template>

<script setup>
const lookBack = [
  {
    title: 'Ramen Bowl',
    image: '../../public/reciepes_discover/ramen.jpg',
    meta: [
      { icon: '⏲', text: '30m' },
      { icon: '🍜', text: 'Japanese' },
      { icon: '🥩', text: 'Non-vegetarian' },
    ],
    rating: 4.7,
  },
  {
    title: 'Chicken Wrap',
    image: '../../public/reciepes_discover/chicken_wrap.jpg',
    meta: [
      { icon: '⏲', text: '15m' },
      { icon: '🌯', text: 'Fusion' },
      { icon: '🥩', text: 'Non-vegetarian' },
    ],
    rating: 4.5,
  },
  {
    title: 'Mango Sticky Rice',
    image: '../../public/reciepes_discover/mango_sticky_rice.jpg',
    meta: [
      { icon: '⏲', text: '20m' },
      { icon: '🥭', text: 'Thai' },
      { icon: '🥗', text: 'Vegetarian' },
    ],
    rating: 4.9,
  },
]
</script>

<style scoped>
.section {
  width: 100vw;
  box-sizing: border-box;
}
.section-title {
  color: #ea563b;
  font-size: 2rem;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: bold;
  margin: 28px 0 0 10px;
  text-align: center;
}
.history-card-stack {
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
  margin-top: 38px;
  width: 100%;
}
.wide-peach-card {
  width: 80vw;
  max-width: 1050px;
  min-width: 350px;
  background: linear-gradient(105deg, #ffe0c2 80%, #ffd4b5 100%);
  border: 2.5px solid #ffd0b7;
  border-radius: 20px;
  box-shadow: 0 8px 44px 6px rgba(240, 170, 120, 0.15);
  transition:
    box-shadow 0.19s,
    transform 0.14s;
  margin-bottom: 20px;
}
.wide-card-content {
  display: flex;
  align-items: center;
  gap: 33px;
  padding: 25px 38px 25px 38px;
}
.wide-img-wrap {
  width: 69px;
  height: 69px;
  border-radius: 14px;
  overflow: hidden;
  background: #ffe7cd;
  box-shadow: 0 1.5px 12px rgba(230, 200, 140, 0.11);
  display: flex;
  align-items: center;
  justify-content: center;
}
.wide-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 11px;
}
.wide-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 12px;
  min-width: 120px;
}
.wide-title {
  font-weight: 900;
  font-size: 1.13rem;
  color: #ea563b;
  letter-spacing: 0.02em;
  font-family: 'Bricolage Grotesque', 'Comic Sans MS', Arial, sans-serif;
}
.wide-meta-row {
  display: flex;
  gap: 13px;
  flex-wrap: wrap;
}
.wide-meta {
  background: #fff4ee;
  border-radius: 11px 16px 14px 15px/14px 15px 13px 11px;
  font-size: 13px;
  padding: 7px 14px;
  color: #c68465;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(210, 140, 80, 0.11);
  display: flex;
  align-items: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.icon {
  font-size: 1.18em;
  margin-right: 2px;
}
.wide-rating {
  font-size: 1.05rem;
  color: #ea563b;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 8px;
}
.tried-on {
  background: #fff2ea;
  color: #bc7e4e;
  font-size: 0.97rem;
  border-radius: 7px;
  font-weight: 600;
  padding: 4px 12px;
  margin-left: 7px;
}

/* Try Again Button, far right */
.wide-try-btn {
  margin-left: auto;
  background: #ea563b;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.08rem;
  font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', Arial, sans-serif;
  font-weight: 700;
  padding: 13px 40px;
  box-shadow:
    0 1px 13px #ffe7cb,
    0 2px 9px rgba(242, 180, 120, 0.15);
  cursor: pointer;
  transition:
    background 0.14s,
    color 0.13s;
}
.wide-try-btn:hover {
  background: #64190c;
  color: rgb(255, 255, 255);
  box-shadow:
    0 0 22px 7px #ffd7ae,
    0 4px 9px rgba(250, 210, 140, 0.14);
  transform: scale(1.03) rotate(5deg);
}

/* Animation for prev card pop up */
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-60px);
}
.slide-fade-enter-active {
  transition:
    opacity 0.28s,
    transform 0.33s;
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
.slide-fade-leave-active {
  transition:
    opacity 0.14s,
    transform 0.23s;
}

/* Responsive for mobile */
@media (max-width: 800px) {
  .wide-peach-card {
    width: 96vw;
    min-width: 92vw;
  }
  .wide-card-content {
    padding: 17px 9vw 17px 7vw;
    gap: 14px;
  }
  .wide-details {
    gap: 7px;
  }
  .wide-try-btn {
    padding: 10px 19px;
    font-size: 1.01rem;
  }
}
</style>
