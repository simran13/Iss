import {useEffect, useState} from "react";
import axios from "axios";
import * as _ from 'lodash';
import update from 'immutability-helper';

import Person from "../comparable/Person";
import Vehicle from "../comparable/Vehicle";
import Starship from "../comparable/Starship";

export default function useCards(initialComp){
    const [computerUncovered, setComputerUncovered] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [playersTurn, setPlayersTurn] = useState(true);
    const [player, setPlayer] = useState([]);
    const [computer, setComputer] = useState([]);
    const [currComp, setCurrComp] = useState(initialComp);
    const [loading, setLoading] = useState(false);

    useEffect( () => {
        setLoading(true);
       getData();
    }, [currComp])

    /**
     * get async data from external api
     */

    async function getData(){
        const url = await fetch(`https://swapi.py4e.com//api/${currComp}`,{ mode: 'cors' });
        const response = await url.json();
        console.log(response)
        
        setLoading(false)

        dealCards(response.results)
        return response
        
        
        {/* TODO Task 2 */}
        {/* TODO Task 2 */}
    }

    useEffect(() => {
        if(selectedProperty !== ''){
            setTimeout(() => {
                compare(selectedProperty);
            }, 2000)
        }
    }, [selectedProperty]);

    useEffect(() => {
        if(computerUncovered === false
            && selectedProperty === ''
            && playersTurn === false
        ) {
            setTimeout(() => {
                const prop = selectRandomProperty();
                play(prop);
            }, 2000)
        }
    }, [computerUncovered, playersTurn, selectedProperty]);

    function compare(prop){
        let playersTurnUpdate = playersTurn;

        const firstPlayer = player[0];
        const firstComputer = computer[0];
        let playerNew, computerNew = [];
        {/* TODO Task 4 splice the first card from player and computer */}
        player.slice(1,0)
        computer.slice(1,0)

        {/* TODO Task 4 */}

        if (firstPlayer[prop] > firstComputer[prop]) {
            // player wins - player gets computers card
            playersTurnUpdate = true;
            {/* TODO Task 4 update players array */}
            setPlayer(computer)

        

            {/* TODO Task 4 */}

            if (computerNew.length === 0) {
                alert('Player wins');
                return;
            }
        } else if (firstPlayer[prop] < firstComputer[prop]) {
            // computer wins - computer gets players card
            
            playersTurnUpdate = false;
            {/* TODO Task 4 update computers array */}
            setComputer(player)

            {/* TODO Task 4 */}

            if (playerNew.length === 0) {
                alert('Computer wins');
                return;
            }
        } else {
            // draw - no card changes
            {/* TODO Task 4 update players and computers array */}
setPlayer(player)
setComputer(computer)
            {/* TODO Task 4 */}
        }

        setPlayersTurn(playersTurnUpdate);
        setSelectedProperty('');
        setComputerUncovered(false);
        setPlayer(playerNew);
        setComputer(computerNew);
    }

    function play(prop){
        setSelectedProperty(prop);
        setComputerUncovered(true);
    }

    function selectRandomProperty(){
        const properties = Object.keys(getProperties());
        const index = Math.floor(Math.random() * properties.length);
        return properties[index];
    }

    /**
     * data should be an array of objects for example like this
     * [{
     *      "name": "Luke Skywalker",
             "height": "172",
             "mass": "77",
     * }]
     * @param data
     */
    function dealCards(data){
        const newComputer = [];
        const newPlayer = [];
        let allCards = [];
        data.forEach((obj) => {
            let newCard = null;
            switch(currComp){
                case 'people':
                    newCard = new Person(
                        obj?.name,
                        parseInt(obj?.height, 10),
                        parseInt(obj?.mass, 10),
                        obj?.films?.length,
                        obj?.starships?.length,
                        obj?.vehicles?.length
                    );
                    break;
                case 'starships':
                    newCard = new Starship(
                        obj?.name,
                        obj?.length,
                        obj?.crew,
                        obj?.cargo_capacity,
                        obj?.pilots?.length,
                        obj?.films?.length,
                    );
                    break;
                case 'vehicles':
                    newCard = new Vehicle(
                        obj?.name,
                        obj?.length,
                        obj?.crew,
                        obj?.cost_in_credits,
                        obj?.pilots?.length,
                        obj?.films?.length,
                    );
                    break;
            }
            allCards.push(newCard);
        })
        allCards = _.shuffle(allCards);
        allCards.forEach((card, idx) => {
            if(idx % 2 === 0){
                newComputer.push(card);
            } else {
                newPlayer.push(card);
            }
        })
        setComputer(newComputer);
        setPlayer(newPlayer);
    }

    function getProperties(){
        switch (currComp){
            case 'people':
                return Person.properties;
            case 'starships':
                return Starship.properties;
            case 'vehicles':
                return Vehicle.properties;
            default:
                return {};
        }
    }

    function reset(){
        getData();
        setComputerUncovered(false);
        setSelectedProperty('');
    }

    return {
        computerUncovered,
        selectedProperty,
        computer,
        player,
        playersTurn,
        loading,
        setCurrComp,
        play,
        getProperties,
        reset
    };
}