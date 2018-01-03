(function() {

d3.scatter = function() {
  var width = 1,
      height = 1,
      duration = 250,
      domain = null,
      value = Number,
      showLabels = false,
      minBPM = 50,
      maxBPM = null;
      fullDataSet = null;
      index = 0;

  function scatter(g) {
    g.each(function(d, i) {
        var time = d['time'];

        //y scale
        var y0 = d3.scale.linear()
            .domain([0, 200])
            .range([height + margin.top, 0]);

        // Retrieve the old x-scale, if this is an update.
        var x0 = d3.scale.linear()
            .domain([0, Infinity])
            .range(y0.range());

        var dot = g.selectAll("circle.scatter")
            .data([d]);

        dot.enter().insert("circle", "text")
            .attr("class", "scatter-dot")
            .attr("r", 3.5)
            .attr("cx", width/2)
            .attr("cy", y0(d))
            .style("fill", function (i){ return heatmapColor(fullDataSet, index, minBPM, maxBPM); })
            .style("stroke", function (i){ return heatmapColor(fullDataSet, index, minBPM, maxBPM); })
            .style("opacity", 0)
          .transition()
            .duration(duration)
            .attr("r", 1)
            .style("opacity", 1);

        dot.on("mouseover", function(){
          this.attr("class", "whisker")
            .attr("dy", ".3em")
            .attr("dx", 6)
            .attr("x", width*.75)
            .attr("y", y0)
            .text(format)
            .style("opacity", 0)
          .transition()
            .duration(duration)
            .style("opacity", 1);
        });

        index++;
    })
  }

    scatter.duration = function(x){
      if (!arguments.length){
        return duration;
      }
      duration = x;
      return scatter;
    };

    scatter.minBPM = function(x) {
      if (!arguments.length) return minBPM;
      minBPM = x;
      return scatter;
    }

    scatter.maxBPM = function(x) {
      if (!arguments.length) return maxBPM;
      maxBPM = x;
      return scatter;
    }

    scatter.fullDataSet = function(x){
      if (!arguments.length) return fullDataSet;
      index = 0;
      fullDataSet = x;
      return scatter;
    }

    scatter.width = function(x){
      if (!arguments.length){
        return width;
      }
      width = x;
      return scatter;
    };

    scatter.height = function(x){
      if (!arguments.length){
        return width;
      }
      height = x;
      return scatter;
    };

    scatter.domain = function(x){
      if (!arguments.length){
        return domain;
      }

      if (domain == null){
        domain = x;
      }
      else {
        domain = d3.functor(x);
      }
      return scatter;
    };
    return scatter;
  };
  function heatmapColor(d, index, minBPM, maxBPM){
    var concentration = 0;

    if (maxBPM == null || d[index] <= maxBPM){
      if (d3.select("#noneFilter").property("checked") == true){ //no filter

        return "#000000";
      }
      else {
        return "#d3d3d3";
      }
    }

    //Checking indices before this index
    for (var i = index; i > 0 && d[i] > minBPM; i--){
      if (Math.abs(d[i] - d[i-1]) <= 2 && d[i] > maxBPM){
        concentration++;
      }
      else{
        break;
      }
    }

    //Checking indices after this index
    for (var i = index; i < d.length && d[i] < maxBPM; i++){
      if (Math.abs(d[i] - d[i+1]) <= 2 && d[i] > maxBPM){
        concentration++;
      }
      else{
        break;
      }
    }


    //Deciding color based on concentration
    switch(concentration){
      case 0:
        return "#FFEC19";
      case 1:
        return "#FFC100";
      case 2:
        return "#FF9800";
      case 3:
        return "#FF5607";
      case 4:
        return "#F6412D";
      case 5:
        return "#F72E18";
      case 6:
        return "#FF260F";
      case 7:
        return "#FC210A";
      case 8:
      default:
        return "#FF0000";
    }
  }
})();
