	function CorrectLH(){}
	let min_height = -20;
	var output_debug = true;
	// 计算两个向量叉乘的结果
	CorrectLH.cross_product_inner = function (vectorA,vectorB) {
		var val = false;
		if(vectorA.length == 3 && vectorB.length == 3){
			val = [];
			val.push(vectorA[1]*vectorB[2] - vectorA[2]*vectorB[1]);
			val.push(vectorA[2]*vectorB[0] - vectorA[0]*vectorB[2]);
			val.push(vectorA[0]*vectorB[1] - vectorA[1]*vectorB[0]);
		}
		return val;
	}//end func.

		// 计算两个向量叉乘的结果
	CorrectLH.cross_product = function(pre,cur,next) {
		var val = false;
		if(pre.length == 3 && cur.length == 3 && next.length == 3){
			var v1 = [];
			v1.push(cur[0] - pre[0]);
			v1.push(cur[1] - pre[1]);
			v1.push(cur[2] - pre[2]);
			var v2 = [];
			v2.push(next[0] - cur[0]);
			v2.push(next[1] - cur[1]);
			v2.push(next[2] - cur[2]);
			return cross_product_inner(v1,v2);
		}
		return val;
	}//end func.

	//计算两个向量点乘的结果
	CorrectLH.dot_product = function (vectorA,vectorB) {
		var val = false;
		if(vectorA.length == vectorB.length){
			val = 0;
			for (var i = 0; i < vectorA.length; i++) {
				val += vectorA[i] * vectorB[i];
			};
		}
		return val;
	}//end func

	//计算向量的模
	CorrectLH.length_normal = function (vector) {
		var total = 0;
		for (var i = 0; i < vector.length; ++i) {
			total += vector[i] * vector[i];
		};
		return Math.sqrt(total);
	}//end func

	//计算向量的模
	CorrectLH.is_equal = function (vectorA,vectorB) {
		var d = 1e-6;
		if(vectorA.length != vectorB.length)
			return false;
		
		for (var i = 0; i < vectorA.length; i++) {
			if(Math.abs(vectorA[i]-vectorB[i])>d)
				return false;
		};
		return true;
	}//end func

	CorrectLH.is_height_change = function (vectorAA,index) {
		if(vectorAA.length <= index)
			return true;
		var vector_info = vectorAA[index];
		if(vector_info.length < 3)
			return true;
		
		var z_cos = vector_info[0];
		var sin = vector_info[1];
		var Z = vector_info[2];

		if(Z < min_height)
			return true;
		if(sin < 0)
			return true;
		if(z_cos < 0.85 && sin > 0.17)
			return true;
	
		return false;
	}//end func


	CorrectLH.reasoning_wrong_range = function (vectorAA,polygon){
		//</double>vector<pair<int,int>>
		for(var i = 0;i < vectorAA.length;i++){
			var vector_info = vectorAA[i];
			var zcos = vector_info[0];
			var sin = vector_info[1];
			var z = vector_info[2];
			if(output_debug)
				console.log("i " + i+" zCos:" + zcos + " sin:" + sin +  " z:" + z);
		}
		var process_range = [];
		//std::vector<pair<int,int>> process_range;
		if(vectorAA.length==0)
			return process_range;
	
		var nStartIndex = 0;
		var nLastIndex = vectorAA.length-1;
		if(polygon) {
			if( CorrectLH.is_height_change(vectorAA,0) ) {
				// todo 连接尾点搜索，环搜索
				var last_index = nLastIndex-1;//倒数第二个点
				while (last_index >= 0) {
					if( CorrectLH.is_height_change(vectorAA,last_index) ) //8
						last_index--;
					else
						break;
				}
				nLastIndex = last_index;
				var start_index = 1;
				while (start_index < vectorAA.length-1) {
					if( CorrectLH.is_height_change(vectorAA,start_index) )
						start_index++;
					else
						break;
				}
				nStartIndex = start_index;
				if(last_index+1 == vectorAA.length-1)
					last_index = -1;
	
				process_range.push([last_index+1,start_index-1]);
				if(output_debug)
					console.log("pair " + (last_index+1) + " --> " + (start_index-1));
			}
		}
	
		var preIndex = -1;
		for(var i = nStartIndex; i <= nLastIndex;i++) {
			if(CorrectLH.is_height_change(vectorAA,i))
			{
				if(preIndex == -1)
					preIndex = i;
				else if(i == nLastIndex){
					process_range.push([preIndex,i]);
					if(output_debug)
						console.log("pair " + preIndex + "--> " + i);
				}
			}
			else
			{
				if(preIndex >= 0){
					process_range.push([preIndex,i-1]);
					if(output_debug){
						console.log("pair " + preIndex + "--> " + (i-1));
					}
					preIndex = -1;
				}
			}
		}
		return process_range;
	}

	CorrectLH.correct_height = function(wrong_range,allPts) {
		var map_index_newZ = new Map();
		// TODO 特殊情况，所有点都变化异常,所有点取线最高点
		if(wrong_range.length == 1){
			var left = wrong_range[0][0];
			var right = wrong_range[0][1];
			var count = 0;
			if(left > right)  //环
				count = (allPts.length - left) + (right-0 + 1);
			else
				count = right - left + 1;
	
			if( count+1 >= allPts.length){
				var dMaxZ = allPts[0][2];
				for(var i = 1;i < allPts.length;++i){
					dMaxZ = Math.max(dMaxZ,allPts[i][2]);
				}
				for(var j = 0; j < allPts.length;++j){
					allPts[j][2] = dMaxZ;
					map_index_newZ.set(j,dMaxZ);
				}
				return map_index_newZ;
			}
		}
	
		for(var i = 0;i < wrong_range.length;++i) {
			var left = wrong_range[i][0];
			var right = wrong_range[i][1];
			//---------------------------------------
			if(left == right) { //孤点略异常
				if(left == 0){
					allPts[left][2] = allPts[left+1][2];
				}	
				else if(left == allPts.length-1){
					allPts[left][2] = allPts[left-1][2];
				}
				else{
					allPts[left][2] = (allPts[left-1][2]+allPts[left+1][2])/2;
				}
				map_index_newZ.set(left,allPts[left][2]);
			}
			else if(left > right) { //环
				var count = (allPts.length-1 - left) + (right-0);
				var h = allPts[right][2] - allPts[left][2];
				var step = h*1.0/count;
				var index = 0;
				var startZ = allPts[left][2];
	
				//left --> allPts.length-1;
				for(var i = left+1;i < allPts.length;++i){
					index++;
					allPts[i][2] = startZ + index*step; //duans
					map_index_newZ.set(i,allPts[i][2]);
				}
	
				// 0
				allPts[0][2] = allPts[allPts.length-1][2]; //duans
				map_index_newZ.set(0,allPts[0][2]);
	
				//1 --> right
				for(var j = 1;j < right; ++j){
					index++;
					allPts[j][2] = startZ + index*step; //duans
					map_index_newZ.set(j,allPts[j][2]);
				}
			}
			else //区间内
			{
				var count = right - left;
				//首尾点异常情况，区间长度为1；
				//中间某个点Z稍微显著，会出现长度为1
				if(count == 1){
					// TODO 判断2点高度是否合理，搜索周围
					if(left == 0) {
						//矫正首点
						allPts[left][2] = allPts[right][2]; //duans
						map_index_newZ.set(left,allPts[left][2]);
					}
					else if(right == allPts.length-1){
						//矫正尾点
						allPts[right][2] = allPts[left][2]; //duans
						map_index_newZ.set(right,allPts[right][2]);
					}
					else{
						//存在中间2个点异常点，往外拓展
						var h = allPts[right+1][2] - allPts[left-1][2];
						allPts[left][2] = allPts[left-1][2] + h/3;     //duans
						allPts[right][2] = allPts[left-1][2] + 2*h/3;  //duans

						map_index_newZ.set(left,allPts[left][2]);
						map_index_newZ.set(right,allPts[right][2]);
					}
				}
				else {
					//区间长度大于1
					//若首尾点在区间边缘，且首尾点的高度不可靠,不能从left->right插值
					// 其前提是left和rightZ可靠
	
					//区间左不可靠，没法插值，区间高度全相同
					if(left==0 && allPts[left][2] < min_height){
						for(var j = left; j < right; ++j){
							allPts[j][2] = allPts[right][2];   //duans
							map_index_newZ.set(j,allPts[j][2]);
						}
						return map_index_newZ;
					}
	
					//区间右侧不可靠，没法插值，让高度全赋left高度
					if(right==allPts.length-1 && allPts[right][2] < min_height){
						for(var j = left+1; j <= right; ++j){
							allPts[j][2] = allPts[left][2];    //duans
							map_index_newZ.set(j,allPts[j][2]);
						}
						return map_index_newZ;
					}
	
					// left和right都可靠，处理区间内元素
					var h = allPts[right][2] - allPts[left][2];
					for(var j = left + 1; j < right; ++j){
						allPts[j][2] = allPts[left][2]+(j-left)*h/count;  //duans
						map_index_newZ.set(j,allPts[j][2]);
					}
				}
			}
		}
		return map_index_newZ;
	}

	CorrectLH.correct_line_height = function(vecPoints) {
		var temp = [0,0,-200];
		let vecPointInfos = new Array(vecPoints.length).fill(temp);
		var is_polygon = CorrectLH.is_equal(vecPoints[0],vecPoints[vecPoints.length-1]);
	
		for(var i = 0;i < vecPoints.length;++i) {
			var array_cur = vecPoints[i];
			var b_check = false;
			var array_pre,array_next;
			//起始点
			if(i == 0) {
			  //面的判断
			  if(is_polygon && i < vecPoints.length-1) {
				  array_pre = vecPoints[vecPoints.length-2];
				  array_next = vecPoints[i+1];
				  b_check = true;
			  }
			  else {
				  // todo
				  array_pre = [array_cur[0]-1,array_cur[1],array_cur[2] ]; //脑补一个起点
				  array_next = vecPoints[i+1];
				  b_check = true;
			  }
			}
			//中间点
			else if(i > 0 && i != vecPoints.length-1) {
				array_pre = vecPoints[i-1] ;
				array_next = vecPoints[i+1];
				b_check = true;
			}
			//尾点
			else if(i == vecPoints.length-1) {
				if(!is_polygon) {
					array_pre = vecPoints[i-1];
					array_next = [array_cur[0]+1,array_cur[1],array_cur[2]];
					b_check = true;
				}
				else {
					vecPointInfos[i] = vecPointInfos[0];
				}
			}
			if(b_check) {
				var nor1 = [array_cur[0]-array_pre[0],array_cur[1]-array_pre[1],array_cur[2]-array_pre[2]];
				var nor2 = [array_next[0]-array_cur[0],array_next[1]-array_cur[1],array_next[2]-array_cur[2]];
				var same_direction = CorrectLH.dot_product(nor1,nor2) > 0;
				var nor = CorrectLH.cross_product_inner(nor1,nor2);//叉乘
				var sin_value = CorrectLH.length_normal(nor)/CorrectLH.length_normal(nor1)/CorrectLH.length_normal(nor2);
				if(!same_direction) sin_value = -sin_value;
				var cosVal;
				if(nor[2] >= 0) {
					var nor1 = [0,0,1];
					cosVal = CorrectLH.dot_product(nor,nor1)/CorrectLH.length_normal(nor);
				} else {
					var nor1 = [0,0,-1];
					cosVal = CorrectLH.dot_product(nor,nor1)/CorrectLH.length_normal(nor);
				}
				var info = [cosVal,sin_value,array_cur[2]];
				vecPointInfos[i] = info;
			}
		}
		var process_range = CorrectLH.reasoning_wrong_range(vecPointInfos,is_polygon);
		var map_id_newz = CorrectLH.correct_height(process_range,vecPoints);
		if(output_debug){
			for(let [key,value] of map_id_newz){
				console.log("index: " + key +" z:" + value);
			}
			for(var i = 0; i < vecPoints.length;++i){
				var pt= vecPoints[i];
				var x = pt[0];
				var y = pt[1];
				var z = pt[2];
				console.log("pt: x: " + x +" y:" + y + " z:" + z);
			}
		}
		return map_id_newz;
	}

