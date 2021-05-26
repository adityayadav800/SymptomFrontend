import React from 'react';
//import './HospForm.css';
import sym from './symptoms'
class HospForm extends React.Component{
    constructor(props){
        super(props);
        this.location=null;
        function setLocation(e){
            console.log('setLocation: ',e);
            this.location={'latitude':e.coords.latitude,'longitude':e.coords.longitude};
        }
        this.featureOptions=sym["symptoms"];
        this.state={
            selectedFeatures: [],
            featureMap: {},
            fetchedData: false,
            result:""
        };
        window.navigator.geolocation.getCurrentPosition(setLocation.bind(this),console.log);
        console.log(this.location);
        this.len=0;
    }
    componentDidMount(){
        console.log('component mounted');
        // fetch('http://localhost:5000/get_hospital_details/',{
        //     method: 'GET',
        //     credentials: 'include'
        // })
        // .then(function(e){
        //     return e.json();
        // })
        // .then((e)=>{
        //     console.log('receieved: ',e)
        //     var selectedFeatures=[]
        //     var featureMap={}
        //     for(var key in e){
        //         if(this.featureOptions.includes(key)){
        //             selectedFeatures.push(key)
        //             featureMap[key]=e[key]                    
        //         }
        //     }
        //     document.querySelector('input[name=address]').value=e['address']
        //     this.setState({
        //         featureMap: featureMap,
        //         selectedFeatures: selectedFeatures
        //     });
        // })
        // .catch(function(e){
        //     console.log(e)
        // });
    }
    addFeature(event){
        event.preventDefault();
        console.log(document.querySelector('select[name=feature'+this.state.selectedFeatures.length+']').value); 
        //console.log(document.querySelector('input[name=feature'+this.state.selectedFeatures.length+']').value);
        var newFeature=document.querySelector('#feature'+this.state.selectedFeatures.length).innerHTML; 
        var newValue=document.querySelector('select[name=feature'+this.state.selectedFeatures.length+']').value;
        var tempMap=this.state.featureMap;
        var tempList=this.state.selectedFeatures;
        tempList.push(newValue);
        tempMap[newFeature]=newValue;
        console.log(tempMap)
        console.log(tempList)
        this.setState({
            featureMap: tempMap,
            selectedFeatures: tempList
        });
    }
    sendData(event){
        event.preventDefault();
        var data=this.state.selectedFeatures;
        data={
            "root":data
        };
        console.log(data);
        fetch('http://localhost:5000/getjson/',{
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(function(e){
                return e.json();
            })
            .then((e)=>{
                console.log(e)
                this.setState({
                           result:e.f
                     });
            })
            .catch(function(e){
                console.log(e)
            });
    }
    removeFeature(event){
        event.preventDefault();
        var feature=event.target.value;
        var tempList=[];
        var tempMap=this.state.featureMap;
        for(var i=0;i<this.state.selectedFeatures.length;i++){
            if(this.state.selectedFeatures[i]!==feature){
                tempList.push(this.state.selectedFeatures[i]);
            }
        }
        delete tempMap[feature];
        this.setState({
            featureMap: tempMap,
            selectedFeatures: tempList
        });
    }
    render(){
        var options=this.featureOptions.map((feature)=>{
            if(!this.state.selectedFeatures.includes(feature)){
                return <option key={feature}>{feature}</option>
            }
        });
        console.log(options);
        var setFeatures=this.state.selectedFeatures.map((feature)=>{
            return <div key={feature}>{'Symptom '} : {feature}<button value={feature} onClick={this.removeFeature.bind(this)}>remove</button></div>;
        });
        return <div>
            {setFeatures}
            <span id={'feature'+this.state.selectedFeatures.length}>{'Symptom '}</span>

            <select name={"feature"+this.state.selectedFeatures.length}>
                {options}

            </select>
            <button onClick={this.addFeature.bind(this)}>add</button><br/>
            <button onClick={this.sendData.bind(this)}>Send Details</button>
            <div>You might have : {this.state.result}</div>
        </div>
        this.len++;
    }
}
export default HospForm;

;