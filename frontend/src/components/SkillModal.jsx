import React, { useEffect, useState } from "react";
const SkillModal = ({active, handleModal, token, id, setErrorMessage}) => {
    const [name, setName] = useState("");
    const [level, setLevel] = useState("");

    useEffect(() => {
        const getSkill = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            const response = await fetch(`/api/skills/${id}`,requestOptions);
            if (!response.ok){
                setErrorMessage("Couldn't find the skill");
            } else{
                const data = await response.json();
                setName(data.name);
                setLevel(data.level);
            }
        };

        if (id){
            getSkill();
        }

    }, [id, token])

    const cleanFormData = () => {
        setName("");
        setLevel("");
    }

    const handleCreateSkill = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({name: name, level: level}),
        };
        const response = await fetch("/api/skills", requestOptions);
        if (!response.ok){
            setErrorMessage("Something went wrong when creating skill")
        }else{
            cleanFormData();
            handleModal();
        }
    }

    const handleUpdateSkill = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({name: name, level: level}),
        };
        const response = await fetch(`/api/skills/${id}`, requestOptions);
        if (!response.ok){
            setErrorMessage("Could not update the skill");
        } else {
            cleanFormData();
            handleModal();
        }
    }

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        {id ? "Update Skill": "Create Skill"}
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    placeholder="Enter skill name" 
                                    value={name} onChange={(e) => setName(e.target.value)}
                                    className="input"
                                    required
                                     />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Level</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    placeholder="Enter skill level" 
                                    value={level} onChange={(e) => setLevel(e.target.value)}
                                    className="input"
                                    required
                                     />
                            </div>
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    {id ? 
                        <button className="button is-info" onClick={handleUpdateSkill}>Update</button>: 
                        <button className="button is-primary" onClick={handleCreateSkill}>Create</button>
                    }
                    <button className="button" onClick={handleModal}>Cancel</button>
                </footer>
            </div>
        </div>
    );
};

export default SkillModal;