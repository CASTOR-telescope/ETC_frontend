/*Javascript functions corresponding to predefined methods in Numpy python library*/

/**
 *         GNU General Public License v3 (GNU GPLv3)
 *
 * (c) 2022.                            (c) 2022.
 * Government of Canada                 Gouvernement du Canada
 * National Research Council            Conseil national de recherches
 * Ottawa, Canada, K1A 0R6              Ottawa, Canada, K1A 0R6
 * All rights reserved                  Tous droits réservés
 *
 * NRC disclaims any warranties,        Le CNRC dénie toute garantie
 * expressed, implied, or               énoncée, implicite ou légale,
 * statutory, of any kind with          de quelque nature que ce
 * respect to the software,             soit, concernant le logiciel,
 * including without limitation         y compris sans restriction
 * any warranty of merchantability      toute garantie de valeur
 * or fitness for a particular          marchande ou de pertinence
 * purpose. NRC shall not be            pour un usage particulier.
 * liable in any event for any          Le CNRC ne pourra en aucun cas
 * damages, whether direct or           être tenu responsable de tout
 * indirect, special or general,        dommage, direct ou indirect,
 * consequential or incidental,         particulier ou général,
 * arising from the use of the          accessoire ou fortuit, résultant
 * software. Neither the name           de l'utilisation du logiciel. Ni
 * of the National Research             le nom du Conseil National de
 * Council of Canada nor the            Recherches du Canada ni les noms
 * names of its contributors may        de ses  participants ne peuvent
 * be used to endorse or promote        être utilisés pour approuver ou
 * products derived from this           promouvoir les produits dérivés
 * software without specific prior      de ce logiciel sans autorisation
 * written permission.                  préalable et particulière
 *                                      par écrit.
 *
 * This file is part of the             Ce fichier fait partie du projet
 * FORECASTOR ETC GUI project.          FORECASTOR ETC GUI.
 *
 * FORECASTOR ETC GUI is free           FORECASTOR ETC GUI est un logiciel
 * software: you can redistribute       libre ; vous pouvez le redistribuer
 * it and/or modify it under the        ou le modifier suivant les termes
 * terms of the GNU General Public      de la "GNU General Public
 * License as published by the          License" telle que publiée
 * Free Software Foundation,            par la Free Software Foundation :
 * either version 3 of the              soit la version 3 de cette
 * License, or (at your option)         licence, soit (à votre gré)
 * any later version.                   toute version ultérieure.
 *
 * FORECASTOR ETC GUI is distributed    FORECASTOR ETC GUI est distribué
 * in the hope that it will be          dans l'espoir qu'il vous
 * useful, but WITHOUT ANY WARRANTY;    sera utile, mais SANS AUCUNE
 * without even the implied warranty    GARANTIE : sans même la garantie
 * of MERCHANTABILITY or FITNESS FOR    implicite de COMMERCIALISABILITÉ
 * A PARTICULAR PURPOSE. See the        ni d'ADÉQUATION À UN OBJECTIF
 * GNU General Public License for       PARTICULIER. Consultez la Licence
 * more details.                        Générale Publique GNU pour plus
 *                                      de détails.
 *
 * You should have received a copy      Vous devriez avoir reçu une copie
 * of the GNU General Public            de la Licence Générale Publique
 * License along with FORECASTOR        GNU avec FORECASTOR ETC GUI ; si
 * ETC GUI. If not, see                 ce n'est pas le cas, consultez :
 * <http://www.gnu.org/licenses/>.      <http://www.gnu.org/licenses/>.
 */

export function linspace(startValue: number, stopValue: number, cardinality: number = 50) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1)
        for (var i = 0; i < cardinality; i++) {
            arr.push(startValue + (step * i))
        }
    return arr
}

export function squareArr(arr: number[]) {
    var newArray: any = [];
    for (var i = 0; i < arr.length; i++) {
        newArray.push(Math.pow(arr[i],2))
    }
    return newArray
}

export function meshgrid(arr1: number[], arr2: number[]) {
    var output1 = [];
    var output2 = [];
    for (var i = 0; i < arr1.length; i++) {
        output1[i] = arr1
    }
    for (var j = 0; j < arr2.length; j++) {
        output2[j] = Array(arr2.length).fill(arr2[j])
    }
    return [output1,output2]
}


export function gaussian2D(x: number[][], y: number[][], sigma: number) {
    var term1 = [];
    var term2:any = [];
    var finalSum:any = [];
    var output:any = [];
    var a = 1;
    for (var i = 0; i < x.length; i++){
       term1.push(squareArr(x[i]).map((item: number)=> item/(2*Math.pow(sigma,2))))
       term2.push(squareArr(y[i]).map((item: number)=> item/(2*Math.pow(sigma,2))))
    }
    for (var i = 0; i < x.length; i++){
        finalSum.push(term1[i].map((num: number,idx: number) => 
            num + term2[i][idx] )); 
    }
    for (var i = 0; i < x.length; i++){
        output.push(finalSum[i].map((item: number)=> a*Math.exp(-item)))
     }
    return output
}

// export function arange(startValue: number, stopValue: number, spacing: number = 1) {
//     if (startValue < stopValue) {
//         var numStep = Math.ceil((stopValue-startValue)/spacing);
//         var arr = [startValue];
//         for (var i = 1; i < numStep; i++) {
//             arr[i] = arr[i-1] + spacing
//         }
//         return arr
//     }

//     else {
//         return null
//     }
// }

export function arange(startValue: number, stopValue: number, spacing: number = 1) {
    if (startValue < stopValue) {
        var arr = [startValue];
        let i = 1;
        do {
            arr[i] = arr[i-1] + spacing
            i +=1
        } while (arr[i-1] < stopValue)
        arr.pop()
        return arr
    }
    else {
        return null
    }
}

export function min2Darray(arr: number[][]) {
    var newArray: number[] = []; 
    for (var i = 0; i < arr.length; i++){
        newArray.push(Math.min.apply(null,arr[i]))
    }
    var result = Math.min.apply(null, newArray)
    return result
}

export function max2Darray(arr: number[][]) {
    var newArray: number[] = []; 
    for (var i = 0; i < arr.length; i++){
        newArray.push(Math.max.apply(null,arr[i]))
    }
    var result = Math.max.apply(null, newArray)
    return result
}

export function sum(arr: number[][]) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++){
        for (var j = 0; j < arr[i].length; j++) {
            sum += arr[i][j]
        }
    }
    return sum
}