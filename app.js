// Requires jQuery

if (window.navigator.userAgent.indexOf('Edge/') > -1)
    alert("IE Edge not supported! Please use Firefox or Chrome instead.");

function setEdit(elm) {
    $("#txtItem").val( elm.id );
    $("#txtText").val( elm.innerHTML );
    $("#txtFont").val( $(elm).css('font-family') );
    $("#txtSize").val( $(elm).css('font-size').replace("px", "") );
    $("#txtColor").val( rgbToHex($(elm).css('fill')) );
}

function save() {
    // hack til at vaelge det valgte tekstfeltet i svg billedet:
    var elm = $("#" + $("#txtItem").val() )[0];
    
    elm.innerHTML = $("#txtText").val(); // tekst
    $(elm).css('font-family', $("#txtFont").val()); // font
    $(elm).css('font-size', $("#txtSize").val() + "px"); // size
    $(elm).css('fill', $("#txtColor").val()); // farve
}

function dropHandler(file) {
    file.stopPropagation(); // don't change webpage to image file
    var localFilename = file.dataTransfer.files[0].name;

	// change bagground
    $('#bgImg')[0].href.baseVal = localFilename;
    $('#fgImg')[0].href.baseVal = localFilename;
}

function getSelectedElements(evt) {
    var BgAndFg = [$('#bgImg')[0],$('#fgImg')[0]];
    if ($.inArray(evt.target, BgAndFg) != -1) {
        // user has selected front- or background, so return both!
        return BgAndFg;
    }
    return [evt.target]; // return list of one element
}

// Modificeret kode fra http://www.petercollingridge.co.uk/interactive-svg-components/draggable-svg-element
var selectedElements = [];
var currentX = 0, currentY = 0;

function selectElement(evt) {
    selectedElements = [evt.target];

    // Special case, if user selects front- or background then make sure to select both:
    var fgAndBg = [ $('#fgImg')[0], $('#bgImg')[0] ];
    if ( $.inArray(evt.target, fgAndBg) != -1) {
        selectedElements = fgAndBg;
    }

    currentX = evt.clientX;
    currentY = evt.clientY;

    selectedElements.forEach(function(selectedElement) {
        selectedElement.setAttributeNS(null, "onmousemove", "moveElement(evt)");
        selectedElement.setAttributeNS(null, "onmouseout", "deselectElement(evt)");
        selectedElement.setAttributeNS(null, "onmouseup", "deselectElement(evt)");
    });
}

function moveElement(evt) {
    var dx = evt.clientX - currentX;
    var dy = evt.clientY - currentY;   
    
    selectedElements.forEach(function(selectedElement) {
        selectedElement.setAttributeNS(null, "x", parseInt(selectedElement.getAttributeNS(null, "x")) + dx );
        selectedElement.setAttributeNS(null, "y", parseInt(selectedElement.getAttributeNS(null, "y")) + dy );
    });

    currentX = evt.clientX;
    currentY = evt.clientY;
}

function deselectElement(evt) {
    selectedElements.forEach(function(selectedElement) {
        if (selectedElement != []) {
            selectedElement.removeAttributeNS(null, "onmousemove");
            selectedElement.removeAttributeNS(null, "onmouseout");
            selectedElement.removeAttributeNS(null, "onmouseup");
            selectedElement = [];
        }
    });
}

function fullCut() { // Prepair border of background for printing
    $("[id=fgImg]").each(function(_,elm) {
        $(elm).attr("clip-path", "url(#badge-full)");
    });
}

function cloneBadge() {
    $($('.badge')[0]).clone().appendTo('#container');
    //$($("#closeBtn")[0]).css("visibility", "collapse"); // Hide delete button from first badge
}

function deleteBadge(badge) {
    if (confirm('Are you sure you want to delete this badge?')) {
        $(badge).parent().detach();
    }
}

// Hack for browsers that doesn't support "beforeprint" (everyone but IE ...)
if ('matchMedia' in window) {
    window.matchMedia('print').addListener(function(media) {
        if (media.matches) {
            console.log("Got print signal")
            fullCut();
        }
    });
}


// HELPERS
function componentToHex(c) {
    var hex = parseInt(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
    // split from rbg(x, y,z) to [x, y, z]
    rgb = rgb.replace(/[^\d,]/g, '').split(',');
    
    // assign r = x, g = y, b = z
    var r = rgb[0], g = rgb[1], b = rgb[2];
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
