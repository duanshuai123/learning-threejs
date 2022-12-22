//源文件
#include <tuple>
#include <utility>
#include <vector>
#include <map>
#include <cstdlib>
#include <cmath>
#include <iostream>
using namespace std;
const double min_height = -20;
const bool output_debug = false;
namespace correct_height {

vector<double> cross_product(const vector<double> &nor1, const vector<double> &nor2) {
    vector<double> nor{
    nor1[1]*nor2[2]-nor1[2]*nor2[1],
    nor1[2]*nor2[0] - nor1[0]*nor2[2],
    nor1[0]*nor2[1] - nor1[1]*nor2[0]};
    return nor;
}

vector<double> cross_product(const vector<double> &pre,const vector<double> &cur, const vector<double> &next) {
    vector<double> nor1{cur[0]-pre[0],cur[1]-pre[1],cur[2]-pre[2]};
    vector<double> nor2{next[0]-cur[0],next[1]-cur[1],next[2]-cur[2]};
    return cross_product(nor1,nor2);
}

double dot_product(const vector<double> &nor1,const vector<double> &nor2){
    return nor1[0] * nor2[0] + nor1[1] * nor2[1] + nor1[2] * nor2[2];
}

double length(const vector<double> &nor){
    return std::sqrt(nor[0]*nor[0] + nor[1]*nor[1]+nor[2]*nor[2]);
}

bool is_equal(const vector<double> &pt1,const vector<double> &pt2){
    double d = 1e-6;
    return abs(pt1[0]-pt2[0]) < d && abs(pt1[1]-pt2[1]) < d && abs(pt1[2]-pt2[2]) < d;
}

bool is_height_change(const vector<tuple<double,double,double>>& vecPointInfos,int nTarget){
    auto z_cos = std::get<0>(vecPointInfos[nTarget]);
    auto sin = std::get<1>(vecPointInfos[nTarget]);
    auto Z = std::get<2>(vecPointInfos[nTarget]);

    if(Z < min_height)
        return true;

    if(sin < 0)
        return true;

    if(z_cos < 0.85 && sin > 0.17)
        return true;

    return false;
}

vector<pair<int,int>> reasoning_wrong_range(const vector<tuple<double,double,double>>& vecPointInfos,bool polygon){
    for(int i = 0;i < vecPointInfos.size();i++){
        auto z_cos = std::get<0>(vecPointInfos[i]);
        auto sin = std::get<1>(vecPointInfos[i]);
        auto Z = std::get<2>(vecPointInfos[i]);
        if(output_debug)
           std::cout << "i " << i << "   zCos:" << z_cos << "   sin:" << sin << "   z:" << Z << std::endl;
    }

    std::vector<pair<int,int>> process_range;
    if(vecPointInfos.size()==0)
        return process_range;

    int nStartIndex = 0;
    int nLastIndex = vecPointInfos.size()-1;
    if(polygon) {
        if( is_height_change(vecPointInfos,0) ) {
            // todo 连接尾点搜索，环搜索
            int last_index = nLastIndex-1;//倒数第二个点
            while (last_index >= 0) {
                if( is_height_change(vecPointInfos,last_index) ) //8
                    last_index--;
                else
                    break;
            }
            nLastIndex = last_index;
            int start_index = 1;
            while (start_index < vecPointInfos.size()-1) {
                if( is_height_change(vecPointInfos,start_index) )
                    start_index++;
                else
                    break;
            }
            nStartIndex = start_index;
            if(last_index+1 == vecPointInfos.size()-1)
                last_index = -1;

            process_range.push_back(std::make_pair(last_index+1,start_index-1));
            if(output_debug)
                cout << "---- pair " << last_index+1 << " --> " << start_index-1 << std::endl;
        }
    }

    int preIndex = -1;
    for(int i = nStartIndex; i <= nLastIndex;i++) {
        if(is_height_change(vecPointInfos,i))
        {
            if(preIndex == -1)
                preIndex = i;
            else if(i == nLastIndex){
                process_range.push_back(std::make_pair(preIndex,i));
                if(output_debug)
                    cout << "---- pair " << preIndex << " --> " << i << std::endl;
            }
        }
        else
        {
            if(preIndex >= 0){
                process_range.push_back(std::make_pair(preIndex,i-1));
                preIndex = -1;
                if(output_debug)
                    cout << "---- pair " << preIndex << " --> " << i-1 << std::endl;
            }
        }
    }
    return process_range;
}

map<int,double> correct_height(std::vector<pair<int,int>> wrong_range,vector<vector<double>>& allPts) {
    std::map<int,double> map_index_newZ;
    // TODO 特殊情况，所有点都变化异常,所有点取线最高点
    if(wrong_range.size()==1){
        auto left = wrong_range[0].first;
        auto right = wrong_range[0].second;
        int count = 0;
        if(left > right)  //环
            count = (allPts.size() - left) + (right-0 + 1);
        else
            count = right - left + 1;

        if( count+1 >= allPts.size()){
            double dMaxZ = allPts[0][2];
            for(int i = 1;i < allPts.size();i++){
                dMaxZ = std::max(dMaxZ,allPts[i][2]);
            }
            for(int j = 0; j < allPts.size();j++){
                allPts[j][2] = dMaxZ;
                map_index_newZ[j] = allPts[j][2];
            }
            return map_index_newZ;
        }
    }

    for(int i = 0;i < wrong_range.size();++i) {
        auto pair = wrong_range[i];
        auto left = pair.first;
        auto right = pair.second;
        if(left == right) { //孤点略异常
            if(left == 0)
                allPts[left][2] = allPts[left+1][2];
            else if(left == allPts.size()-1)
                allPts[left][2] = allPts[left-1][2];
            else
                allPts[left][2] = (allPts[left-1][2]+allPts[left+1][2])/2;

            map_index_newZ[left] = allPts[left][2];
        }
        else if(left > right) { //环
            int count = (allPts.size()-1 - left) + (right-0);
            double h = allPts[right][2] - allPts[left][2];
            double step = h*1.0/count;
            int index = 0;
            double startZ = allPts[left][2];

            //left --> allPts.size()-1;
            for(auto i = left+1;i < allPts.size();++i){
                index++;
                allPts[i][2] = startZ + index*step;
                map_index_newZ[i] = allPts[i][2];
            }

            // 0
            allPts[0][2] = allPts[allPts.size()-1][2];
            map_index_newZ[0] = allPts[0][2];

            //1 --> right
            for(auto j = 1;j < right; ++j){
                index++;
                allPts[j][2] = startZ + index*step;
                map_index_newZ[j] = allPts[j][2];
            }
        }
        else //区间内
        {
            auto count = right - left;
            //首尾点异常情况，区间长度为1；
            //中间某个点Z稍微显著，会出现长度为1
            if(count == 1){
                // TODO 判断2点高度是否合理，搜索周围
                if(left == 0) {
                    //矫正首点
                    allPts[left][2] = allPts[right][2];
                    map_index_newZ[left] = allPts[left][2];
                }
                else if(right == allPts.size()-1){
                    //矫正尾点
                    allPts[right][2] = allPts[left][2];
                    map_index_newZ[right] = allPts[right][2];
                }
                else{
                    //存在中间2个点异常点，往外拓展
                    double h = allPts[right+1][2] - allPts[left-1][2];
                    allPts[left][2] = allPts[left-1][2] + h/3;
                    allPts[right][2] = allPts[left-1][2] + 2*h/3;

                    map_index_newZ[left]=allPts[left][2];
					map_index_newZ[right]=allPts[right][2];
                }
            }
            else {
                //区间长度大于1
                //若首尾点在区间边缘，且首尾点的高度不可靠,不能从left->right插值
                // 其前提是left和rightZ可靠

                //区间左不可靠，没法插值，区间高度全相同
                if(left==0 && allPts[left][2] < min_height){
                    for(int j = left; j < right; ++j){
                        allPts[j][2] = allPts[right][2];
                        map_index_newZ[j] = allPts[j][2];
                    }
                    return map_index_newZ;
                }

                //区间右侧不可靠，没法插值，让高度全赋left高度
                if(right==allPts.size()-1 && allPts[right][2] < min_height){
                    for(int j = left+1; j <= right; ++j){
                        allPts[j][2] = allPts[left][2];
                        map_index_newZ[j] = allPts[j][2];
                    }
                    return map_index_newZ;
                }

                // left和right都可靠，处理区间内元素
                double h = allPts[right][2] - allPts[left][2];
                for(int j = left + 1; j < right; ++j){
                    allPts[j][2] = allPts[left][2]+(j-left)*h/count;
                    map_index_newZ[j] = allPts[j][2];
                }
            }
        }
    }
    return map_index_newZ;
}

void correct_line_height(vector<vector<double>>& vecPoints) {
    std::tuple<double,double,double> temp{0,0,-200};
    std::vector<std::tuple<double,double,double>> vecPointInfos(vecPoints.size(),temp);
    bool is_polygon = is_equal(vecPoints[0],vecPoints[vecPoints.size()-1]);

    for(auto i = 0;i < vecPoints.size();++i) {
        vector<double> array_cur = vecPoints[i];
        bool b_check = false;
        vector<double> array_pre,array_next;
        //起始点
        if(i == 0) {
          //面的判断
          if(is_polygon && i < vecPoints.size()-1) {
              array_pre = vecPoints[vecPoints.size()-2];
              array_next = vecPoints[i+1];
              b_check = true;
          }
          else {
              // todo
              array_pre ={array_cur[0]-1,array_cur[1],array_cur[2]}; //脑补一个起点
              array_next = vecPoints[i+1];
              b_check = true;
          }
        }
        //中间点
        else if(i > 0 && i != vecPoints.size()-1) {
            array_pre = vecPoints[i-1] ;
            array_next = vecPoints[i+1];
            b_check = true;
        }
        //尾点
        else if(i == vecPoints.size()-1) {
            if(!is_polygon) {
                array_pre = vecPoints[i-1];
                array_next = {array_cur[0]+1,array_cur[1],array_cur[2]};
                b_check = true;
            }
            else {
                vecPointInfos[i] = vecPointInfos[0];
            }
        }
        if(b_check) {
            vector<double> nor1{array_cur[0]-array_pre[0],array_cur[1]-array_pre[1],array_cur[2]-array_pre[2]};
            vector<double> nor2{array_next[0]-array_cur[0],array_next[1]-array_cur[1],array_next[2]-array_cur[2]};
            bool same_direction = dot_product(nor1,nor2) > 0;
            vector<double> nor = cross_product(nor1,nor2);//叉乘
            double sin_value = length(nor)/length(nor1)/length(nor2);
            if(!same_direction) sin_value = -sin_value;
            double cosVal;
            if(nor[2] >= 0) {
                cosVal = dot_product(nor,vector<double>{0,0,1})/length(nor);
            } else {
                cosVal = dot_product(nor,vector<double>{0,0,-1})/length(nor);
            }
            vecPointInfos[i] = std::make_tuple(cosVal,sin_value,array_cur[2]);
        }
    }
    std::vector<std::pair<int,int>> process_range = reasoning_wrong_range(vecPointInfos,is_polygon);
    correct_height(process_range,vecPoints);
}

}
