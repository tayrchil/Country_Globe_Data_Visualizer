setGraph(true);
var setThisFocus = false;


//function to call graph drawing passing values from drop down
function setGraph(param) {
    if(param === false){
        drawGraph( $('#y-value').val(),false);}
    else if(param === true) {
        drawGraph( $('#y-value').val(),true);}
}


// Function to read  x and y axis attribute from drop down and draw the graph
function drawGraph( yText,brushval) {

    $('svg').remove();
    var xText;

//Defining X and Y axis variables for each of selection- GDP/ Population/ Agriculture
    if (yText === 'GDP ($ per capita)') {
        xText = 'Literacy (%)'
    }
    else if (yText === 'Deathrate') {
        xText = 'Birthrate'
    }
    else if (yText === 'Agriculture') {
        xText = 'Arable (%)'
    }

//SVG settings
    var margin = {top: 20, right: 10, bottom: 100, left: 100},

        width = 800 - margin.right - margin.left,

        height = 500 - margin.top - margin.bottom;


    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


//SVG definition
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    /*
    var
           currentTransform = null;
            //SVG definition
              var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")
             // .attr("clip-path", "url(#clip)");
             var view = svg.append("g")
            .attr("class", "view");
              if (currentTransform) view.attr('transform', currentTransform);

    */


// define x and y scales


    var xScale = d3.scaleLinear()
        .range([0, width])


    var yScale = d3.scaleLinear()

        .range([height, 0]);


// define x axis and y axis


    var xAxis = d3.axisBottom(xScale);
//.tickPadding(10).ticks(5);


    var yAxis = d3.axisLeft(yScale);


//An array to read a country and highlight- this needs to be updated through globe code

    countryArray = [''];

//Read data from source file

    d3.csv("data/countries of the world_2.csv", function (error, data) {

        if (error) console.log("Error: data not loaded!");
        data.forEach(function (d) {

            d.country = d.Country;
            d.xText = +d[xText];

            d.yText = +d[yText];


        });


        // Specify the domains of the x and y scales

        xScale.domain(d3.extent(data, function (d) {
            return d.xText;
        }));

//xScale.domain([0, d3.max(data, function(d) { return +d.xText; } ) ]);


        yScale.domain([0, d3.max(data, function (d) {
            return d.yText;
        })]);


        // Draw xAxis and position the label

        var gX = svg.append("g")

            .attr("class", "axis")

            .attr("transform", "translate(0," + (height + 160) + ")")

            .call(xAxis)
            .selectAll("text")
            .attr("dx", "-.4em")
            .attr("dy", ".25em")
            .style("text-anchor", "end")
            .attr("font-size", "10px")
            .style("fill", '#F6F6F6')
        ;
        //formatting axis depending on variable
        if (yText === 'Deathrate') {
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", margin.bottom + 390)
                .attr("fill", "#F6F6F6")
                .attr("font-size", "13")
                .style("font", "13px sans-serif")
                .text(xText + "%");
        }
        else if (yText === 'GDP ($ per capita)') {
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", margin.bottom + 390)
                .attr("fill", "#F6F6F6")
                .attr("font-size", "13")
                .style("font", "13px sans-serif")
                .text(xText);
        }
        else if (yText === 'Agriculture') {
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", margin.bottom + 390)
                .attr("fill", "#F6F6F6")
                .attr("font-size", "13")
                .style("font", "13px sans-serif")
                .text(xText);
        }

        // Draw yAxis and postion the label

        var gY = svg.append("g")

            .attr("class", "y axis")
            .call(yAxis)
            .selectAll("text")
            .style("fill", "#F6F6F6")




       var set = svg.append("text")
            .style("font", "13px sans-serif")
            .attr("transform", "rotate(-90)")
            .attr("x", - height / 2)
            .attr("y", -50)
            .attr("dy", "0em")
            .style("text-anchor", "middle")
            .style("fill", "#F6F6F6")
           .text(yText);





        //pan and zoom
        /*	var zoom = d3.zoom()
            .scaleExtent([.5, 5])
            //.extent([[0, 0], [width, height]])
            .translateExtent([
                [-width * 2, -height * 2],
                [width * 2, height * 2]])
            .on("zoom", zoomed); */


        //var zoom = d3.zoom().on('zoom', zoomed);


//Color as a function of region
        var cValue = function (d) {
            return d.Region;
        };

        var color = d3.scaleOrdinal(d3.schemeCategory10);


// Array to read value for comparison with CountryArray
        var newArray = [];

//Plotting points on graph

        var circles = svg.selectAll('circle')

            .data(data)
            .enter()
            .append('circle')

            //.attr("clip-path", "url(#clip)")
            .attr('r', function (d, i) { // for highlighted country, radius is 10, otherwise 4
                newArray = [];
                newArray = d.Country;

                if (newArray.trim() === (countryArray[0])) {
                    return "10"
                }
                else {
                    return "4"
                }

            })
            .attr('country', function (d) {
                return d.Country
            })
			.attr('region', function (d) {
				return d.Region_fortree
			})	
            .attr('cx', function (d) {
                return xScale(d.xText);
            })
             // .attr("country", d.Country)
            .attr('cy', function (d) {
                return yScale(d.yText);
            })


            .style("fill", function (d, i) {
                newArray = [];
                newArray = d.Country;
                if (newArray.trim() === (countryArray[0])) {
                    return "red"
                }
                else {
                    return color(cValue(d))
                }
            })
            .style("stroke", function (d, i) {
                newArray = [];
                newArray = d.Country;
                if (newArray.trim() === (countryArray[0])) {
                    return "Deep Red"
                }
                else {
                    return color(cValue(d))
                }
            })
            .style("stroke-width", function (d, i) {
                newArray = [];
                newArray = d.Country;
                if (newArray.trim() === (countryArray[0])) {
                    return "3"
                }
                else {
                    return "0"
                }
            })
            .style("fill-opacity", function (d, i) {
                if (countryArray.length >= 1) {
                    newArray = [];
                    newArray = d.Country;
                    if (newArray.trim() === countryArray[0]) {
                        return "4"
                    }
                    else {
                        return ".8"
                    }
                }
                else {
                    return "2"
                }

            });


        //mouse over to display tooltip
        circles.on("mouseover", function (d) {

            d3.select(this).attr("r", "15");
            div.transition()
                .duration(200)
                .style("opacity", 5)

            //console.log(yText);
            if (yText === "GDP ($ per capita)") {
                div.html("Country:" + d.Country + "<br/>" + "GDP($): " + formatNumber(d.yText) + "<br/>" + "Literacy: "+ d.xText + "%")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")



            }
            else if (yText === "Deathrate") {
                div.html("Country:" + d.Country + "<br/>" + "Deathrate: " + d.Deathrate + "%" +"<br/>" + "Birthrate: "+ d.Birthrate + "%")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")

            }
            else if (yText === "Agriculture") {
                div.html("Country:" + d.Country + "<br/>" + "Agri: " + formatNumber(d.yText * 100) + "%"+"<br/>" + "Areable: "+ d.xText + "%")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")

            }

        })

            .on("mouseout", function (d) {
                d3.select(this).attr("r", "4");
                div.transition()
                    .duration(500)
                    //.style("display","none")
                    .style("opacity", 0);
            })


        //defining legends for region
        var legendspacing = "10";
        // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 492)
            .attr("y", function (d, i) {
                return (4 - (legendspacing * i))
            })
            .attr("width", 5)
            .attr("height", 5)
            .style("fill", color);

        // draw legend text
        legend.append("text")
            .attr("x", width - 500)
            .attr("y", function (d, i) {
                return (5 - (legendspacing * i))
            })
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            })
            .style("font-size", 8)



        //Brushing mechanism- highlight brushed circles

        if (brushval === false) {

            function highlightBrushedCircles() {

                if (d3.event.selection != null) {

                    // revert circles to initial style
                    circles.attr("class", "non_brushed");

                    var brush_coords = d3.brushSelection(this);

                    // style brushed circles
                    circles.filter(function () {

                        var cx = d3.select(this).attr("cx"),
                            cy = d3.select(this).attr("cy");

                        return isBrushed(brush_coords, cx, cy);
                    })
                        .attr("class", "brushed");
                }
            }

            //display table for highlighted circles
            function displayTable() {

                // disregard brushes w/o selections

                if (!d3.event.selection) return;

                // programmed clearing of brush after mouse-up

                d3.select(this).call(brush.move, null);

                var d_brushed = d3.selectAll(".brushed").data();

                // populate table if one or more elements is brushed
                if (d_brushed.length > 0) {
                    clearTableRows();
                    d_brushed.forEach(d_row => populateTableRow(d_row))
                } else {
                    clearTableRows();
                }
            }


            var brush = d3.brush()
                .on("brush", highlightBrushedCircles)
                .on("end", displayTable);

            svg.append("g")
                .call(brush);

        }
        else {
            clearTableRows();
        }
    });//d3.csv ends here


    function clearTableRows() {

        hideTableColNames();
        d3.selectAll(".row_data").remove();
    }

    function isBrushed(brush_coords, cx, cy) {

        var x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];

        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    function hideTableColNames() {
        d3.select("table").style("visibility", "hidden");
    }

    function showTableColNames() {
        d3.select("table").style("visibility", "visible");
    }

    function populateTableRow(d_row) {

        showTableColNames();
		var formatComma = d3.format(",");
		var formatPercent = d3.format(",.2%");
		

        var d_row_filter = [d_row.Country,
            //d_row.GDP ($ per capita),
            formatPercent(d_row.Agriculture),
            formatPercent(d_row.Industry),
            formatPercent(d_row.Service),
            formatComma(d_row.Population)];


        d3.select("table")
            .append("tr")
            .attr("class", "row_data")
            .selectAll("td")
            .data(d_row_filter)
            .enter()
            .append("td")
            .attr("align", (d, i) => i == 0 ? "left" : "right")
            .text(d => d);
    }


//treemap code begins here
//$('svg').remove();
    d3.select("#tree_svg").remove();

    var el_id = 'chart2';
    var obj = document.getElementById(el_id);
    var divWidth = obj.offsetWidth;
    var margin = {top: 30, right: 0, bottom: 20, left: 0},
        width = 760,
        height = 600 - margin.top - margin.bottom - 330,
        formatNumber = d3.format(","),
        transitioning;
    // sets x and y scale to determine size of visible boxes

    var x = d3.scaleLinear()
        .domain([0, width])
        .range([0, width]);
    var y = d3.scaleLinear()
        .domain([0, height])
        .range([0, height]);
    var treemap = d3.treemap()
        .size([width, height])
        .paddingInner(0)
        .round(false);
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    var tree_svg = d3.select('#' + el_id).append("svg")
        .attr("id", "tree_svg")
        .attr("width", width + margin.left + margin.right + 50)
        .attr("height", height + margin.bottom + margin.top)
        .style("margin-left", -margin.left + "px")
        .style("margin.right", -margin.right + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 30 + ")")
        .style("shape-rendering", "crispEdges");
    var grandparent = tree_svg.append("g")
        .attr("class", "grandparent");
    grandparent.append("rect")
        .attr("y", -margin.top)
        .attr("width", width)
        .attr("height", margin.top)
        .attr("fill", '#bbbbbb');
    grandparent.append("text")
        .attr("x", 6)
        .attr("y", 6 - margin.top)
        .attr("dy", ".75em");


    //d3.json("budget-data.json", function(data) {
    var src;
    if (yText === 'GDP ($ per capita)') {
        src = "data/treemap_industry.json"
    }
    else if (yText === 'Deathrate') {
        src = "data/treemap_population.json"
    }
    else if (yText === 'Agriculture') {
        src = "data/treemap_crops.json"
    }


    //src = "treemap_countries.json";
    d3.json(src, function (data) {
		console.log(data);
        var root = d3.hierarchy(data);
        console.log(root);
        treemap(root
            .sum(function (d) {
                return d.value;
            })
            .sort(function (a, b) {
                return b.height - a.height || b.value - a.value
            })
        );
        display(root);

        function display(d) {
            // write text into grandparent
            // and activate click's handler
            grandparent
                .datum(d.parent)
                .on("click", transition)
                .select("text")
                .text(name(d));
            // grandparent color
            grandparent
                .datum(d.parent)
                .select("rect")
                .attr("fill", "#bbbbbb");
            var g1 = tree_svg.insert("g", ".grandparent")
                .datum(d)
                .attr("class", "depth");
            var g = g1.selectAll("g")
                .data(d.children)
                .enter()
                .append("g")
                .on("mouseover", function (d) {
						div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    if (yText === "GDP ($ per capita)") {
						
						if(d.data.type === "continent"){
								div.html("</br>"+d.data.name)
								.style("left", (d3.event.pageX) + "px")
								.style("top", (d3.event.pageY-28) + "px")
								.attr("paddingInner","10");}
								
						else{		
                        div.html(d.data.name + "<br/>" + formatNumber(d.value*100) + " %")
                            .style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY - 28) + "px");}
                    }
					
                    else if (yText === "Deathrate") {
						if(d.data.type === "continent"){
								div.html(d.data.name+ "<br/>" + formatNumber(d.value))
								.style("left", (d3.event.pageX) + "px")
								.style("top", (d3.event.pageY - 28) + "px");}
						
						else{
                        div.html(d.data.name + "<br/>" + formatNumber(d.value))
                            .style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY - 28) + "px");}
                    }
                    else if (yText === "Agriculture") {
                        if(d.data.type === "continent"){
								div.html("</br>"+d.data.name)
								.style("left", (d3.event.pageX) + "px")
								.style("top", (d3.event.pageY - 28) + "px");}
						
						else{
						div.html(d.data.name + "<br/>" + formatNumber(d.value) + " %")
                            .style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY - 28) + "px");}
                    }
					
					
					//if (d.data.type == "continent"){console.log("Parent hover");}
					
					if(d.data.type=="continent")
					{
						
						//d3.selectAll("circle").each(function(d) {
						//	if (svg.selectAll("circle").attr("region")==d.data.name)
						//	{console.log(d3.select(this).attr("region"));}
						//	console.log(d3.selectAll("circle").filter(_conditions_).attr("region"));
						//})
											
						//var att = d3.selectAll("circle").filter(function(d){
						//return d3.selectAll("circle").attr("region") == d.data.name;
						//}).attr("country");
						
						//console.log(att);
						
						var cname=d.data.name;
						d3.selectAll("circle").each(function(d){
							var elt = d3.select(this);
							if (elt.attr("region") == cname){
								//console.log("aaaaa");
								d3.select(this).attr("r",18);
							}
						});
						
						
						//var continent_name=d.data.name;
						//if(svg.selectAll('circle').attr("region")===continent_name)
						//{
						//	console.log("circles selected "+continent_name);
						//}
						//else{console.log("error");}
					}
					
						
                })
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
						
					d3.selectAll("circle").attr("r",4);
                });


            // add class and click handler to all g's with children
            g.filter(function (d) {
                return d.children;
            })
                .classed("children", true)
                .on("click", transition);
				g.selectAll(".child")
                .data(function (d) {
                    return d.children || [d];
                })
                .enter().append("rect")
                .attr("class", "child")
                .call(rect)
                //.attr("fill", "#bbbbbb");

            // add title to parents
            g.append("rect")
                .attr("class", "parent")
                .call(rect)//draws initial rectangles
                .append("title")
                .attr("location", function(d) {
                    return d.data.name
                })
                .text(function (d) {
                    return d.data.name;
                });
            /* Adding a foreign object instead of a text object, allows for text wrapping */
            g.append("foreignObject")
                .call(rect)
                .attr("class", "foreignobj")
                .append("xhtml:div")
                .attr("dy", ".75em")
                .html(function (d) {
                    return '' +
                        '<p class="title"> ' + d.data.name
                        //+ '</p>' +
                        //'<p>' + formatNumber(d.value) + '</p>'
                        ;
                })
                .attr("class", "textdiv"); //textdiv class allows us to style the text easily with CSS
            function transition(d) {
                if (transitioning || !d) return;
                transitioning = true;
                var g2 = display(d),
                    t1 = g1.transition().duration(650),
                    t2 = g2.transition().duration(650);
                // Update the domain only after entering new elements.
                x.domain([d.x0, d.x1]);
                y.domain([d.y0, d.y1]);
                // Enable anti-aliasing during the transition.
                tree_svg.style("shape-rendering", null);
                // Draw child nodes on top of parent nodes.
                tree_svg.selectAll(".depth").sort(function (a, b) {
                    return a.depth - b.depth;
                });
                // Fade-in entering text.
                g2.selectAll("text").style("fill-opacity", 0);
                g2.selectAll("foreignObject div").style("display", "none");
                /*added*/
                // Transition to the new view.
                t1.selectAll("text").call(text).style("fill-opacity", 0);
                t2.selectAll("text").call(text).style("fill-opacity", 1);
                t1.selectAll("rect").call(rect);
                t2.selectAll("rect").call(rect);
                /* Foreign object */
                t1.selectAll(".textdiv").style("display", "none");
                /* added */
                t1.selectAll(".foreignobj").call(foreign);
                /* added */
                t2.selectAll(".textdiv").style("display", "block");
                /* added */
                t2.selectAll(".foreignobj").call(foreign);
                /* added */
                // Remove the old node when the transition is finished.
                t1.on("end.remove", function () {
                    this.remove();
                    transitioning = false;
                });
            }

            return g;
        }

        function text(text) {
            text.attr("x", function (d) {
                return x(d.x) + 6;
            })
                .attr("y", function (d) {
                    return y(d.y) + 6;
                });
        }


        function rect(rect) {
            //	var color = d3.scaleOrdinal(d3.schemeCategory10);

            //var ex = max-height(d.value);
            //d3.select("div.parent").html("");
            //d3.select("g.parent").selectAll("*").remove();
            //var color = d3.scaleLinear()
            //    .domain([1, 10])
            //    .range(['#bd0026', '#006d2c'])
            //    .interpolate(d3.interpolateHcl);//hsl, hcl, rgb
				
			var color = d3.scaleOrdinal()
			.range(d3.schemeCategory10
			.map(function(c) { c = d3.rgb(c); c.opacity = 0.8; return c; }));
            
			rect
                .attr("x", function (d) {
                    return x(d.x0);
                })
                .attr("y", function (d) {
                    return y(d.y0);
                })
                .attr("width", function (d) {
                    return x(d.x1) - x(d.x0);
                })
                .attr("height", function (d) {
                    return y(d.y1) - y(d.y0);
                })
                .attr("fill", function (d) {
                    return color(d.value);
                })
            //.attr("fill", function(d) { return d.children ? null:color(d.parent.value)})

            //.attr("fill", colourFunction);
            //.attr('fill', function(d){return d.value > 0 ? d3.scaleLinear(d3.schemeCategory20)(d.area) : 'transparent';})
        }

        function rect1(rect) {
            //	var color = d3.scaleOrdinal(d3.schemeCategory10);
            var color = d3.scaleLinear()
                .domain([1, 15])
                .range(['yellow', 'blue'])
                .interpolate(d3.interpolateHsl);
            rect
                .attr("x", function (d) {
                    return x(d.x0);
                })
                .attr("y", function (d) {
                    return y(d.y0);
                })
                .attr("width", function (d) {
                    return x(d.x1) - x(d.x0);
                })
                .attr("height", function (d) {
                    return y(d.y1) - y(d.y0);
                })
                //.attr("fill", function (d) {return '#bbbbbb';});
                //.attr("fill", "blue");
            //.attr("fill", colourFunction);
            //.attr('fill', function(d){return d.value > 0 ? d3.scaleLinear(d3.schemeCategory20)(d.area) : 'transparent';})
        }

        function foreign(foreign) { /* added */
            foreign
                .attr("x", function (d) {
                    return x(d.x0);
                })
                .attr("y", function (d) {
                    return y(d.y0);
                })
                .attr("width", function (d) {
                    return x(d.x1) - x(d.x0);
                })
                .attr("height", function (d) {
                    return y(d.y1) - y(d.y0);
                });
        }

        function name(d) {
            return breadcrumbs(d) +
                (d.parent
                    ? " -  Click to zoom out"
                    : " - Click inside square to zoom in");
        }

        function breadcrumbs(d) {
            var res = "";
            var sep = " > ";
            d.ancestors().reverse().forEach(function (i) {
                res += i.data.name + sep;
            });
            return res
                .split(sep)
                .filter(function (i) {
                    return i !== "";
                })
                .join(sep);
        }
    })//end of json function

}