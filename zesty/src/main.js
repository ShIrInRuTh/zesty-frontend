// main.js

// Create the Vue application instance
new Vue({
    el: '#app', // Binds Vue to the div with id="app"
    data: {
        // You can store application state here, e.g.:
        userLoggedIn: false,
        recipesLoaded: false
    },
    methods: {
        startCooking() {
            // This method is called when the "Start Cooking!" button is clicked
            console.log("Navigating to Ingredient Input Page...");
            // In a real app, you would use Vue Router to navigate:
            // this.$router.push('/ingredients');
            alert("Let's get cooking! (Simulated navigation to ingredient input)");
        },
        signUp() {
            // This method is called when the "Sign Up for Free!" button is clicked
            console.log("Navigating to Sign Up Page...");
            // In a real app, this would show a modal or navigate:
            // this.$router.push('/signup');
            alert("Welcome! (Simulated navigation to sign up)");
        }
        // Other methods like loadRecipes, saveFavorite, etc., would go here
    },
    mounted() {
        // Code to run when the component is first loaded
        console.log("Mystery Recipe Generator App loaded successfully.");
    }
});