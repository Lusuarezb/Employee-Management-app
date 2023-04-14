import React, {useContext, useState} from 'react';
import ErrorMessage from './ErrorMessage';
import SkillModal from './SkillModal';
import { UserContext } from '../context/UserContext';

const Table = ({getSkills, skills, loaded}) => {
    const [token] = useContext(UserContext);
    const [activeModal, setActiveModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [id, setId] = useState(null);

    const handleUpdate = async (id) => {
        setId(id);
        setActiveModal(true);
    };

    const handleDelete = async (id) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch(`/api/skills/${id}`, requestOptions);
        if (!response.ok){
            setErrorMessage("Failed to delete skill")
        }else {
            getSkills();
        }
    };



    const handleModal = () => {
        setActiveModal(!activeModal);
        getSkills();
        setId(null);
    }

    return (
        <>
        <SkillModal active={activeModal} handleModal={handleModal} token={token} id={id} setErrorMessage={setErrorMessage}/>
        <button className='button is-fullwidth mb-5 is-primary' onClick={() => setActiveModal(true)}>
            Create Skill
        </button>
        <ErrorMessage message={errorMessage} />
        {loaded && skills ? (
            <table className='table is-fullwidth'>
                <thead>
                    <tr>
                        <th>Skill</th>
                        <th>Level</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {skills.map((skill) => (
                        <tr key={skill.id}>
                            <td>{skill.name}</td>
                            <td>{skill.level}</td>
                            <td>
                                <button className='button mr-2 is-info is-light' onClick={() => handleUpdate(skill.id)}>Update</button>
                                <button className='button mr-2 is-danger is-light' onClick={() => handleDelete(skill.id)}>Delete</button>
                            </td>
                                
                        </tr>
                    ))}
                </tbody>

            </table>): <p>Loading</p>}
        </>
    );
};

export default Table;