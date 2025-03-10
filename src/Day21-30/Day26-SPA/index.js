
import Dashboard from "./Pages/Dashboard.js";
import Posts from "./Pages/Posts.js";
import Settings from "./Pages/Settings.js";

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};


//defining the paths and routes
const router = async() => {
    const routes = [
        {path: "/", view: Dashboard },
        {path: "/posts", view: Posts },
        {path: "/settings", view: Settings }
    ];

    //test each routes for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch:location.pathname === route.path
        };
    });

    let match = potentialMatches.find(potentialMatche => potentialMatche.isMatch);

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true

        };
    }

    const view = new match.route.view();

    document.querySelector("#app").innerHTML = await view.getHtml();


    console.log(match.route.view());
};

window.addEventListener("popstate", router);

//prevents default page refresh
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    router();
});