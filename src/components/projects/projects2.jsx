import React, {useEffect, useState} from 'react';
import lightspeed from "../../assets/images/flash-sprite-2.png";

function Projects(props) {
    const [data, updateDate] = useState([
        {
            name: 'Monopoly Deal',
            url: 'https://monopolydeal.herokuapp.com',
            icon: 'icon-deal',
            class: 'deal',
        },
        {
            name: 'Blackjack',
            url: 'https://ammorishita.github.io/Blackjack',
            icon: 'icon-blackjack',
            class: 'blackjack',
        },
        {
            name: 'Lightspeed Runner',
            url: 'https://ammorishita.github.io/LightSpeedRunner/',
            icon: 'icon-lightspeed',
            class: 'lightspeed',
            image: 'lightspeed',
        },
        {
            name: 'Grid Blaster',
            url: 'https://ammorishita.github.io/GridBlaster/game.html',
            icon: 'icon-grid-blaster',
            class: 'grid',
        },
    ]);
    const activeClass = (props.active === "projects")
        ? "projects active"
        : "projects";
    const lightspeedStyle = {
        backgroundImage: `url(${lightspeed})`,
    };
    return (
        <div className={activeClass}>
            <ul className="projects__list">
                {data.map(item => {
                    return (<li className="projects__item" key={item.class}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className={`projects__link projects__link--${item.class}`}>
                            <h3 className="projects__title">{item.name}</h3>
                            {(item.image === 'lightspeed' ? 
                                (<div className="projects__image" style={lightspeedStyle}></div>) 
                                : ('') 
                            )}
                            <svg className={`icon-svg projects__icon projects__icon--${item.class}`}>
                                <use xlinkHref={`#${item.icon}`}></use>
                            </svg>
                        </a>
                    </li>)
                })}
            </ul>
        </div>
    )
}

export default Projects;
