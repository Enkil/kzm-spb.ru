window.onload = function(){

    function submenuClick(){
        var subItems = document.querySelectorAll('.submenu__item');
        for (var i = 0; i < subItems.length; i++){
            subItems[i].addEventListener("click", function(){
                //urlLink = this.firstElementChild.href;
                window.location = this.firstElementChild.href;
            })
        }
    }

    function submenuL2Click(){
        var subItems = document.querySelectorAll('.submenu-l2__item');
        for (var i = 0; i < subItems.length; i++){
            subItems[i].addEventListener("click", function(){
                //urlLink = this.firstElementChild.href;
                window.location = this.firstElementChild.href;
            })
        }
    }

    submenuClick();
    submenuL2Click();

    // FadeIn and FadeOut submenu
    fadeMenu('.js-menu-item', '.js-fade', 'is-hidden');
    fadeMenu('.js-submenu-item', '.js-fade2', 'is-hidden');
};

