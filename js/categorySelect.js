$("ul.tabs div li").click(function () {
var $this = $(this);
var $theTab = $(this).attr("id");
console.log($theTab);
if ($this.hasClass("active")) {
} else {
    $this
    .closest(".tabs_wrapper")
    .find("ul.tabs div li, .tabs_container .tab_content")
    .removeClass("active");
    $(
    '.tabs_container .tab_content[data-tab="' +
        $theTab +
        '"], ul.tabs div li[id="' +
        $theTab +
        '"]'
    ).addClass("active");
}
});