function makeHead(shape, points_expression, name){

    var rotation_expression = 
        
        points_expression+"diff = sub(p1, p2)\
        \
        radians = Math.atan2(diff[1], diff[0])\
        \
        radiansToDegrees(radians)+90"

    var position_expression = 
        points_expression+"position =p1"

    var head1     = shape.property("Contents").addProperty("ADBE Vector Group")
    head1.name    = name
    head1.property("Transform").property("Scale").setValue([10,25])
    head1.property("Transform").property("Position").expression = position_expression
    head1.property("Transform").property("Rotation").expression = rotation_expression
    var triangle1 = head1.property("Contents").addProperty("ADBE Vector Shape - Star")
    triangle1.property("Type").setValue(2)
    triangle1.property("Points").setValue(3)
    triangle1.position.setValue([0,85])
    head1.property("Contents").addProperty("ADBE Vector Graphic - Fill")
}

function makeLine(shape, points_expression){

    var pathExpression = 
        points_expression+"pts = [p1, p2];\
        \
        createPath(points = pts, inTangents = [], outTangents = [], isClosed = false)"

    var trimExpression1 = 
        points_expression+"diff = sub(p1, p2)\
        \
        len = length(diff);\
        \
        100-(len-50)/len*50"

    var trimExpression2 = 
        points_expression+"diff = sub(p1, p2)\
        \
        len = length(diff);\
        \
        (len-50)/len*50"



    var line1     = shape.property("Contents").addProperty("ADBE Vector Group")
    line1.name = "line1"
    var linePath1 = line1.property("Contents").addProperty("ADBE Vector Shape - Group")
    linePath1.path.expression = pathExpression
    var trimPath1 = line1.property("Contents").addProperty("ADBE Vector Filter - Trim")
    trimPath1.start.setValue(0)
    trimPath1.end.expression = trimExpression2
    var stroke = line1.property("Contents").addProperty("ADBE Vector Graphic - Stroke")
    stroke.color.expression = "[255,0,0,1]" 
    
    
    var line2     = shape.property("Contents").addProperty("ADBE Vector Group")
    line2.name = "line2"
    
    var linePath2 = line2.property("Contents").addProperty("ADBE Vector Shape - Group")
    linePath2.path.expression = pathExpression


    var trimPath2 = line2.property("Contents").addProperty("ADBE Vector Filter - Trim")
    trimPath2.start.expression = trimExpression1
    trimPath2.end.setValue(100)
    
    var stroke = line2.property("Contents").addProperty("ADBE Vector Graphic - Stroke")
    stroke.color.expression = "[255,0,0,1]" 
    

}

function makeText(layer, points_expression,name){

    var length_expression = 
    points_expression+"diff = sub(p1, p2)\
        \
        len = length(diff).toFixed(0)"

    var position_expression = 
    points_expression+"position = add(p1, p2)/2"

        
    layer.name = name
    var animator = layer.text.Animators.addProperty("ADBE Text Animator")
    var textColor = animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color")
    textColor.setValue([1,0,0,1])
    layer.sourceText.expression = length_expression
    layer.position.expression = position_expression
    layer.anchorPoint.setValue([0,-6])

}

function makeMeasure(x1, y1, x2, y2, name){
    var shape     = comp.layers.addShape()
    var text      = comp.layers.addText()
    shape.property("Transform").property("Position").setValue([0,0])
    shape.name    = name

    var points_expression = 
    "p1 = [" + x1 + ", " + y1 + "] \n \
     p2 = [" + x2 + ", " + y2 + "] \n"

    var points_expression2 = 
    "p1 = [" + x2 + ", " + y2 + "] \n \
     p2 = [" + x1 + ", " + y1 + "] \n"
    
    makeHead(shape, points_expression, "head1")
    makeHead(shape, points_expression2, "head2")
    makeLine(shape, points_expression)
    makeText(text, points_expression, name + "Value")
}

function makeRect(x1,y1,x2,y2,x3,y3,x4,y4, name, color){
    var shape     = comp.layers.addShape()
    shape.name    = name

    var rectExpression = 
    "p1 = [" + x1 + ", " + y1 + "] \n \
     p2 = [" + x2 + ", " + y2 + "] \n \
     p3 = [" + x3 + ", " + y3 + "] \n \
     p4 = [" + x4 + ", " + y4 + "] \n \
     pts = [p1,p2,p3,p4] \n \
     createPath(points = pts, inTangents = [], outTangents = [], isClosed = true)"

    var rect = shape.property("Contents").addProperty("ADBE Vector Shape - Group")
    shape.position.setValue([0,0])
    rect.path.expression = rectExpression
    var fill = shape.property("Contents").addProperty("ADBE Vector Graphic - Fill")
    fill.color.setValue(color)
}

function createElements(){
    makeRect(xl4, yu4, xr4, yu4, xr4, yd4, xl4, yd4, "Margin" , [1 ,.5,.5,1])
    makeRect(xl3, yu3, xr3, yu3, xr3, yd3, xl3, yd3, "Border" , [1 , 1,.5,1])
    makeRect(xl2, yu2, xr2, yu2, xr2, yd2, xl2, yd2, "Padding", [.5, 1,.5,1])
    makeRect(xl1, yu1, xr1, yu1, xr1, yd1, xl1, yd1, "Content", [.5,.5, 1,1])
    
    makeMeasure(xr1, y0, xr2, y0, "paddingRight")
    makeMeasure(xl1, y0, xl2, y0, "paddingLeft")
    makeMeasure(x0, yu1, x0, yu2, "paddingUp")
    makeMeasure(x0, yd1, x0, yd2, "paddingDown")
    
    makeMeasure(xr3, y0, xr4, y0, "marginRight")
    makeMeasure(xl3, y0, xl4, y0, "marginLeft")
    makeMeasure(x0, yu3, x0, yu4, "marginUp")
    makeMeasure(x0, yd3, x0, yd4, "marginDown")
    
    makeMeasure(xr2, y0, xr3, y0, "borderRight")
    makeMeasure(xl2, y0, xl3, y0, "borderLeft")
    makeMeasure(x0, yu2, x0, yu3, "borderUp")
    makeMeasure(x0, yd2, x0, yd3, "borderDown")
}

function toggleLayer(name){
    comp.layer(name).enabled = !comp.layer(name).enabled
}

function showLayer(name, show){
    comp.layer(name).enabled = show
}

function toggleMargin(){
    toggleLayer("Margin")
    toggleLayer("marginDown")
    toggleLayer("marginRight")
    toggleLayer("marginLeft")
    toggleLayer("marginUp")
    toggleLayer("marginDownValue")
    toggleLayer("marginRightValue")
    toggleLayer("marginLeftValue")
    toggleLayer("marginUpValue")
}

function showMargin(show){
    showLayer("Margin", show)
    showLayer("marginDown", show)
    showLayer("marginRight", show)
    showLayer("marginLeft", show)
    showLayer("marginUp", show)
    showLayer("marginDownValue", show)
    showLayer("marginRightValue", show)
    showLayer("marginLeftValue", show)
    showLayer("marginUpValue", show)
}

function showPadding(show){
    showLayer("Padding", show)
    showLayer("paddingDown", show)
    showLayer("paddingRight", show)
    showLayer("paddingLeft", show)
    showLayer("paddingUp", show)
    showLayer("paddingDownValue", show)
    showLayer("paddingRightValue", show)
    showLayer("paddingLeftValue", show)
    showLayer("paddingUpValue", show)
}

function showBorder(show){
    showLayer("Border", show)
    showLayer("borderDown", show)
    showLayer("borderRight", show)
    showLayer("borderLeft", show)
    showLayer("borderUp", show)
    showLayer("borderDownValue", show)
    showLayer("borderRightValue", show)
    showLayer("borderLeftValue", show)
    showLayer("borderUpValue", show)
}

function showMeasures(show){
    showLayer("borderDown", show)
    showLayer("borderRight", show)
    showLayer("borderLeft", show)
    showLayer("borderUp", show)
    showLayer("borderDownValue", show)
    showLayer("borderRightValue", show)
    showLayer("borderLeftValue", show)
    showLayer("borderUpValue", show)

    showLayer("marginDown", show)
    showLayer("marginRight", show)
    showLayer("marginLeft", show)
    showLayer("marginUp", show)
    showLayer("marginDownValue", show)
    showLayer("marginRightValue", show)
    showLayer("marginLeftValue", show)
    showLayer("marginUpValue", show)

    showLayer("paddingDown", show)
    showLayer("paddingRight", show)
    showLayer("paddingLeft", show)
    showLayer("paddingUp", show)
    showLayer("paddingDownValue", show)
    showLayer("paddingRightValue", show)
    showLayer("paddingLeftValue", show)
    showLayer("paddingUpValue", show)
}

function togglePadding(){
    toggleLayer("Padding")
    toggleLayer("paddingDown")
    toggleLayer("paddingRight")
    toggleLayer("paddingLeft")
    toggleLayer("paddingUp")
    toggleLayer("paddingDownValue")
    toggleLayer("paddingRightValue")
    toggleLayer("paddingLeftValue")
    toggleLayer("paddingUpValue")
}

function toggleBorder(){
    toggleLayer("Border")
    toggleLayer("borderDown")
    toggleLayer("borderRight")
    toggleLayer("borderLeft")
    toggleLayer("borderUp")
    toggleLayer("borderDownValue")
    toggleLayer("borderRightValue")
    toggleLayer("borderLeftValue")
    toggleLayer("borderUpValue")
}

function global(name){
    return comp.layer("Global").effect(name)("Slider")
}

function setKey(name, time, value){
    var ease = new KeyframeEase(1, 33);
    global(name).setValueAtTime(time,value)
    global(name).setTemporalEaseAtKey(1, [ease], [ease]);
}

function setPaddingKeys(time, values){
    switch (values.length) {
        case 1:
            setKey("paddingLeft",  time, values[0])
            setKey("paddingUp",    time, values[0])
            setKey("paddingRight", time, values[0])
            setKey("paddingDown",  time, values[0])
            break;
        case 2:
            setKey("paddingDown",  time, values[0])
            setKey("paddingUp",    time, values[0])
            setKey("paddingLeft",  time, values[1])
            setKey("paddingRight", time, values[1])
            break;
        case 4:
            setKey("paddingUp",    time, values[0])
            setKey("paddingRight", time, values[1])
            setKey("paddingDown",  time, values[2])
            setKey("paddingLeft",  time, values[3])
            break;
        default:
            break;
    }
}

function setBorderKeys(time, values){
    switch (values.length) {
        case 1:
            setKey("borderLeft",  time, values[0])
            setKey("borderUp",    time, values[0])
            setKey("borderRight", time, values[0])
            setKey("borderDown",  time, values[0])
            break;
        case 2:
            setKey("borderDown",  time, values[0])
            setKey("borderUp",    time, values[0])
            setKey("borderLeft",  time, values[1])
            setKey("borderRight", time, values[1])
            break;
        case 4:
            setKey("borderUp",    time, values[0])
            setKey("borderRight", time, values[1])
            setKey("borderDown",  time, values[2])
            setKey("borderLeft",  time, values[3])
            break;
        default:
            break;
    }
}

function setMarginKeys(time, values){
    switch (values.length) {
        case 1:
            setKey("marginLeft",  time, values[0])
            setKey("marginUp",    time, values[0])
            setKey("marginRight", time, values[0])
            setKey("marginDown",  time, values[0])
            break;
        case 2:
            setKey("marginDown",  time, values[0])
            setKey("marginUp",    time, values[0])
            setKey("marginLeft",  time, values[1])
            setKey("marginRight", time, values[1])
            break;
        case 4:
            setKey("marginUp",    time, values[0])
            setKey("marginRight", time, values[1])
            setKey("marginDown",  time, values[2])
            setKey("marginLeft",  time, values[3])
            break;
        default:
            break;
    }
}

var project = app.project
var comp = project.activeItem

var position     = 'thisComp.layer("Global").effect("position")("Point")'
var width        = 'thisComp.layer("Global").effect("width")("Slider")'
var height       = 'thisComp.layer("Global").effect("height")("Slider")'

var paddingLeft  = 'thisComp.layer("Global").effect("paddingLeft")("Slider")'
var paddingUp    = 'thisComp.layer("Global").effect("paddingUp")("Slider")'
var paddingRight = 'thisComp.layer("Global").effect("paddingRight")("Slider")'
var paddingDown  = 'thisComp.layer("Global").effect("paddingDown")("Slider")'

var marginLeft   = 'thisComp.layer("Global").effect("marginLeft")("Slider")'
var marginUp     = 'thisComp.layer("Global").effect("marginUp")("Slider")'
var marginRight  = 'thisComp.layer("Global").effect("marginRight")("Slider")'
var marginDown   = 'thisComp.layer("Global").effect("marginDown")("Slider")'

var borderLeft   = 'thisComp.layer("Global").effect("borderLeft")("Slider")'
var borderUp     = 'thisComp.layer("Global").effect("borderUp")("Slider")'
var borderRight  = 'thisComp.layer("Global").effect("borderRight")("Slider")'
var borderDown   = 'thisComp.layer("Global").effect("borderDown")("Slider")'

var x0  = position + "[0]"
var xl1 = x0 + "-" + width +"/2"
var xr1 = x0 + "+" + width +"/2"
var xl2 = xl1 + "-" + paddingLeft
var xr2 = xr1 + "+" + paddingRight
var xl3 = xl2 + "-" + borderLeft
var xr3 = xr2 + "+" + borderRight
var xl4 = xl3 + "-" + marginLeft
var xr4 = xr3 + "+" + marginRight

var y0  = position + "[1]"
var yu1 = y0 + "-" + height +"/2"
var yd1 = y0 + "+" + height +"/2"
var yu2 = yu1 + "-" + paddingUp
var yd2 = yd1 + "+" + paddingDown
var yu3 = yu2 + "-" + borderUp
var yd3 = yd2 + "+" + borderDown
var yu4 = yu3 + "-" + marginUp
var yd4 = yd3 + "+" + marginDown

// createElements()

// toggleMargin() 
// toggleBorder() 
// togglePadding()

showBorder(true)
showMargin(false)
showPadding(true)

showMeasures(false)

// setKey("width", 0, 100)
// setKey("width", 1, 100)
// setKey("width", 2, 200)
// setKey("width", 3, 200)
// setKey("width", 4, 100)

// setKey("height", 0, 100)
// setKey("height", 5, 100)
// setKey("height", 6, 200)
// setKey("height", 7, 200)
// setKey("height", 8, 100)


setPaddingKeys(0, [1])
setBorderKeys(0, [1])

setPaddingKeys(1, [100])
setPaddingKeys(2, [100])
setPaddingKeys(3, [1])
setPaddingKeys(4, [1])

setPaddingKeys(5, [1,1])
setPaddingKeys(6, [100,1])
setPaddingKeys(7, [100,1])
setPaddingKeys(8, [1,1])
setPaddingKeys(9, [1,1])

setPaddingKeys(10, [1,1])
setPaddingKeys(11, [1,100])
setPaddingKeys(12, [1,100])

setPaddingKeys(13, [100])
setPaddingKeys(14, [100])

setBorderKeys(15, [1])
setBorderKeys(16, [100])
setBorderKeys(17, [100])
setBorderKeys(18, [1])
setBorderKeys(19, [1])

setBorderKeys(20, [1,1])
setBorderKeys(21, [100,1])
setBorderKeys(22, [100,1])
setBorderKeys(23, [1,1])
setBorderKeys(24, [1,1])

setBorderKeys(25, [1,1])
setBorderKeys(26, [1,100])
setBorderKeys(27, [1,100])