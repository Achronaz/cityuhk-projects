<!DOCTYPE html>
<html>

<head>
    <title>CS3402 Assignment</title>
</head>
<style>
    .house tr td { 
        cursor:pointer;
    }
    .red {
        background: red;
    }
    .green {
        background: green;
    }
    .yellow {
        background: yellow;
    }
</style>
<body>
<h2>Movie Ticketing System</h2>
    <div id="app">
        <table class="house" border="1" cellspacing="1">
            <tr v-for="(row, ridx) in house" :key="ridx">
                <td>{{rows[ridx]}}</td>
                <td v-for="(col, cidx) in row" 
                    :key="cidx" 
                    :class="{green: col === 0, yellow: col === 1, red: col === 2}" 
                    @click="toggle(ridx, cidx, col)" >
                    {{rows[ridx]}}{{cidx}}
                </td>
            </tr>
            <tr>
                <td></td>
                <td v-for="(col, cidx) in house[0]" :key="cidx">{{cidx}}</td>
            </tr>
        </table>
<pre>
House       :<select name="house" id="" v-model="houseid" @change="getHouseStatus()"><option value="1" selected>House A</option><option value="2">House B</option><option value="3">House C</option><option value="4">House D</option><option value="5">House E</option></select>

Your email  :<input type="email" v-model="clientemail">

Your name   :<input type="text" v-model="clientname">

By Quantity :<input type="number" max="10" v-model="quantity" placeholder="max:10"> <input type="button" value="Order" @click="orderTickets(1)">

By Selection:<input type="button" value="Order Selected" @click="orderTickets(2)">

<input type="button" value="Reset" @click="resetDB()">

<span v-if="loading">loading ...</span>
</pre>
        
    </div>
    <script src="https://unpkg.com/vue"></script>
    <script src="https://unpkg.com/vue-resource@1.5.1/dist/vue-resource.min.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                rows:['A','B','C','D','E'],
                houseid:1,
                house:[
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0]
                ],
                loading: false,
                clientname:'',
                clientemail:'',
                quantity:0
            },
            methods:{
                toggle(ridx, cidx, col){
                    let status = this.house[ridx][cidx];
                    if(status !== 2)
                        this.$set(this.house[ridx], cidx, status === 1 ? 0 : 1);
                    //else
                        //alert('no more than 10 seats in a order.');
                },
                showRowSelected(){
                    console.log(this.rowSelected);
                },
                getHouseStatus(){
                    let self = this;
                    self.resetHouse();
                    self.loading = true;
                    this.$http.get('/~kktsang27/assignment/query.php',{
                        params:{
                            houseid:self.houseid
                        }
                    }).then(response => {
                        self.loading = false;
                        let res = response.body;
                        if(res.code === 100){
                            res.data.forEach((order)=>{
                                let ridx = parseInt(self.rows.indexOf(order.SEAT_NO.substring(0,1)));
                                let cidx = parseInt(order.SEAT_NO.substring(1,2));
                                //console.log(ridx, cidx);
                                self.$set(self.house[ridx], cidx, 2);
                            });
                        }
                    }, error => {
                        self.loading = false;
                        console.log(error);
                    });
                },
                orderTickets(option){
                    let self = this;
                    let input = {};
                    if(option === 1){
                      input = {
                        houseid:self.houseid,
                        clientname:self.clientname,
                        clientemail:self.clientemail,
                        qty:self.quantity
                      }
                      if(self.clientname === '' || self.clientemail === '' || self.quantity < 1 || self.quantity > 10){
                        return alert('Invalid name, email or quantity.');
                      }
                    } else {
                      input = {
                        houseid:self.houseid,
                        clientname:self.clientname,
                        clientemail:self.clientemail,
                        seats:self.rowSelected
                      }
                      if(self.clientname === '' || self.clientemail === '' || self.rowSelected.length === 0){
                        return alert('Missing name, email and selected seat.');
                      }
                    }
                    
                    self.loading = true;
                    this.$http.get('/~kktsang27/assignment/order.php',{
                        params:input
                    }).then(response => {
                        self.loading = false;
                        self.getHouseStatus();
                        if(response.body.code == 200) alert(response.body.msg);
                    }, error => {
                        self.loading = false;
                        console.log(error);
                    });
                },
                resetHouse(){
                    this.house = [
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0]
                    ];
                },
                resetDB(){
                  let self = this;
                  this.$http.get('/~kktsang27/assignment/reset.php').then(response => {
                        self.loading = false;
                        self.getHouseStatus();
                    }, error => {
                        self.loading = false;
                        console.log(error);
                    });
                }
            },
            computed: {
                rowSelected: function(){
                    let temp = [];
                    this.house.forEach((row,ridx)=>{
                        row.forEach((col, cidx)=>{
                            if(col === 1){
                                temp.push(this.rows[ridx]+cidx+'');
                            }
                        }); 
                    });
                    return temp.join(',');
                }
            },
            mounted: function(){
                this.getHouseStatus();
            }
        })
    </script>
</body>
</html>