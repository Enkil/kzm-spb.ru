window.onload = function(){

    // FadeIn and FadeOut submenu
    fadeMenu('.js-menu-item', '.js-fade', 'is-hidden');
    fadeMenu('.js-submenu-item', '.js-fade2', 'is-hidden');
};


/**
 *
 * @param el
 * @param classname
 */

// fade out
function fadeOut(el, classname){
    el.style.opacity = 1;

    (function fade() {
        if ((el.style.opacity -= 0.1) < 0) {
            el.style.display = 'none';
            el.classList.add(classname);
        } else {
            requestAnimationFrame(fade);
        }
    })();
}

// fade in
function fadeIn(el, classname, display){
    if (el.classList.contains(classname)){
        el.classList.remove(classname);
    }
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += 0.1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
}

// Add events to submenu
function fadeMenu(item, subitem, classname){
    var items = document.querySelectorAll(item),
        subitems = document.querySelectorAll(subitem);

    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', function(e){

            event.preventDefault();

            var el = this.querySelector(subitem);

            // Find and set invisible all subelements
            for (var n = 0; n < subitems.length; n++) {
                subitems[n].classList.add(classname);
            }

            // Set current subitem visible
            if(el.classList.contains(classname)){
                fadeIn(el, classname);
            }
            else {
                fadeOut(el, classname);
            }

        });
    }
}