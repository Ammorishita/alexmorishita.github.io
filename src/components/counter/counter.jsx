import React, {useEffect, useState} from 'react';

function Counter(props) {
    const [formValues, updateValues] = useState({
        name: '',
        email: '',
        category: '',
    });
    const [progress, updateProgress] = useState(0);
    function getValues(e) {
        const value = e.target.value;
        const name = e.target.name;
        updateValues({...formValues, [name] : value});
    }

    const activeClass = (props.active === "counter")
        ? "counter active"
        : "counter";

    useEffect( () => {
        updateProgress(() => {
            let counter = 0;
            for(const prop in formValues) {
                if(formValues[prop] !== '') {
                    counter++;
                }
            }
            return counter;
        });
    })
    return (
        
        <div className={activeClass}>
            <form>
                <input className="form__input" type="text" name="name" onChange={getValues}/>
                <input className="form__input" type="email" name="email" onChange={getValues}/>
                <select name="category" id="category" onChange={getValues}>
                    <option value="">Select</option>
                    <option value="1">1</option>
                </select>
                <p>Progress {progress}</p>
            </form>
        </div>
    )
}

export default Counter;