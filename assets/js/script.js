$(document).ready(function () {

    // ============================================================
    // RELOJ
    // ============================================================
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        const s = String(now.getSeconds()).padStart(2, "0");
        $("#clock").text(`${h}:${m}:${s}`);
    }
    updateClock();
    setInterval(updateClock, 1000);



    // ============================================================
    // MANEJO DE VENTANAS
    // ============================================================
    let isDragging = false;
    let currentWindow = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let zIndexCounter = 10;
    let clickTimer = null;



    // -------------------------------------------
    // Activar ventana al hacer clic (traer al frente)
    // -------------------------------------------
    $(".window").on("mousedown", function () {
        $(this).css("z-index", ++zIndexCounter);
    });



    // -------------------------------------------
    // DRAG — INICIO
    // -------------------------------------------
    $(".window__header").on("mousedown", function (e) {
        if (e.which !== 1) return; 

        currentWindow = $(this).closest(".window");

        isDragging = true;

        // animación más suave
        currentWindow.css("transition", "none");

        const pos = currentWindow.offset();
        dragOffsetX = e.pageX - pos.left;
        dragOffsetY = e.pageY - pos.top;

        $("body").addClass("no-select");

        e.preventDefault();
    });



    // -------------------------------------------
    // DRAG — MOVIMIENTO
    // -------------------------------------------
    $(document).on("mousemove", function (e) {
        if (!isDragging || !currentWindow) return;

        const desktop = $(".desktop");
        const desktopOffset = desktop.offset();

        const maxX = desktop.width() - currentWindow.outerWidth();
        const maxY = desktop.height() - currentWindow.outerHeight();

        let x = e.pageX - dragOffsetX - desktopOffset.left;
        let y = e.pageY - dragOffsetY - desktopOffset.top;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(40, Math.min(y, maxY));

        currentWindow.css({ left: x, top: y });
    });



    // -------------------------------------------
    // DRAG — FIN
    // -------------------------------------------
    $(document).on("mouseup", function () {
        isDragging = false;
        $("body").removeClass("no-select");

        if (currentWindow) {
            setTimeout(() => currentWindow.css("transition", ""), 50);
        }
        currentWindow = null;
    });



    // -------------------------------------------
    // MAXIMIZAR CON DOBLE CLIC EN EL HEADER
    // -------------------------------------------
    $(".window__header").on("dblclick", function () {
        $(this).closest(".window").find(".window__btn--maximize").trigger("click");
    });



    // -------------------------------------------
    // BOTÓN MINIMIZAR
    // -------------------------------------------
    $(".window__btn--minimize").on("click", function (e) {
        e.stopPropagation();

        const win = $(this).closest(".window");
        win.addClass("minimized");

        setTimeout(() => {
            win.hide().removeClass("minimized");
        }, 280);
    });



    // -------------------------------------------
    // BOTÓN MAXIMIZAR / RESTAURAR
    // -------------------------------------------
    $(".window__btn--maximize").on("click", function (e) {
        e.stopPropagation();

        const win = $(this).closest(".window");
        const desktop = $(".desktop");
        const tb = 40;

        if (win.hasClass("maximized")) {
            // Restaurar ventana
            win.removeClass("maximized");

            win.css({
                top: win.data("top"),
                left: win.data("left"),
                width: win.data("width"),
                height: win.data("height"),
            });

        } else {
            // Guardar posición antes de maximizar
            win.data("top", win.css("top"));
            win.data("left", win.css("left"));
            win.data("width", win.css("width"));
            win.data("height", win.css("height"));

            win.addClass("maximized");

            win.css({
                top: tb + "px",
                left: 0,
                width: desktop.width() + "px",
                height: desktop.height() - tb + "px",
            });
        }
    });



    // -------------------------------------------
    // BOTÓN CERRAR
    // -------------------------------------------
    $(".window__btn--close").on("click", function (e) {
        e.stopPropagation();

        const win = $(this).closest(".window");
        win.addClass("closed");

        setTimeout(() => {
            win.hide().removeClass("closed");
        }, 250);
    });



});
