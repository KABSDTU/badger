function setEdit(elm) {
    $("#txtItem").val( elm.id );
    $("#txtText").val( elm.innerHTML );
    $("#txtFont").val( $(elm).css('font-family') );
    $("#txtSize").val( $(elm).css('font-size') );
    $("#txtColor").val( rgbToHex($(elm).css('fill')) );
}

function save() {
    // hack til at vaelge det valgte tekstfeltet i svg billedet:
    var elm = $("#" + $("#txtItem").val() )[0];
    
    elm.innerHTML = $("#txtText").val(); // tekst

    $(elm).css('font-family', $("#txtFont").val()); // font

    //elm.style['font-size'] = $("#txtSize").val(); 
    $(elm).css('font-size', $("#txtSize").val()); // size

    $(elm).css('fill', $("#txtColor").val()); // farve
}

function dropHandler(file) {
    file.stopPropagation(); // don't change webpage to image file
    var localFilename = file.dataTransfer.files[0].name;
    var BgAndFg = [$('#bgImg')[0],$('#fgImg')[0]]; 
    if ($.inArray(file.target, BgAndFg) != -1) {
	// change bagground
        $('#bgImg')[0].href.baseVal = localFilename;
        $('#fgImg')[0].href.baseVal = localFilename;
    /*} else if (file.target == $('#addImg')[0]) {
        var img = $(new Image());
	img.attr('class', 'draggable');
	img.attr('onmousedown', 'selectElement(event)');
	img.attr('ondragover', 'event.preventDefault()');
	img.attr('src', '' + localFilename).appendTo($(file.target)).fadeIn();
    */
    } else {
	file.target.href = localFilename;
	//console.log("change image " + file.target + " to image " + localFilename);
    }
    //file.dataTransfer.files[0] // Problems with Chrome Dev Console: http://stackoverflow.com/a/11573873
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
        if (selectedElement != 0) {
            selectedElement.removeAttributeNS(null, "onmousemove");
            selectedElement.removeAttributeNS(null, "onmouseout");
            selectedElement.removeAttributeNS(null, "onmouseup");
            selectedElement = 0;
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
