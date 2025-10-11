<template>
  <!-- FOOTER -->
  <footer>
    <div class="footer-container">
      <!-- Column 1: Logo + Mission -->
      <div class="footer-desc">
        <img src="/logo.png" alt="Ecohive Logo" class="footer-logo" />
        <h3>Zesty</h3>
        <p>
          We are committed to providing excellent services and delivering value to our customers
          with integrity and passion.
        </p>
      </div>

      <!-- Column 2: Contact Us -->
      <div class="footer-column" id="contact">
        <h4>Contact Us</h4>
        <!-- <img src="../../public/club penguin.jpg" alt="Ecohive Logo" class="lols" /> -->
        <p>support@yoursite.com</p>
        <p>+1 (234) 567-890</p>
      </div>

      <!-- Column 3: Quick Links -->
      <div class="footer-column">
        <h4>Quick Links</h4>
        <a href="#">About Us</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>

      <!-- Column 4: Follow Us -->
      <div class="footer-column">
        <h4>Follow Us</h4>
        <a href="#">Twitter</a>
        <a href="#">GitHub</a>
        <a href="#">LinkedIn</a>
      </div>
    </div>

    <div class="footer-bottom">© {{ new Date().getFullYear() }} Zesty. All rights reserved.</div>
  </footer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque&family=Plus+Jakarta+Sans:wght@400;600&display=swap');

/* FOOTER */
footer {
  background-color: #e0c6a6;
  padding: 10px 10px;
  text-align: left;
  font-family: 'Bricolage Grotesque', sans-serif;
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin: 0 auto;
  height: fit-content;
}

.footer-desc {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
}

.footer-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  border-left: 1px solid grey;
}

.footer-desc h3 {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 12px;
  color: #0c291c;
  margin: 0.5rem auto;
}

.footer-desc p {
  font-size: 12px;
  color: #333;
  text-align: center;
  margin: 0 auto;
  text-decoration: none;
}

.footer-column h3,
.footer-column h4 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #0c291c;
  text-align: center;
  width: auto;
}

.footer-column p,
.footer-column a {
  font-size: 12px;
  color: #333;
  margin-bottom: 8px;
  text-decoration: none;
}

.footer-column a:hover {
  text-decoration: underline;
  color: #44704d;
}

.footer-logo {
  width: 100px;
  margin: 10px auto;
}

.lols {
  width: 150px;
  margin-bottom: 20px;
  margin: auto;
}

.footer-bottom {
  text-align: right;
  margin-top: 10px;
  font-size: 12px;
  color: #555;
}
</style>
