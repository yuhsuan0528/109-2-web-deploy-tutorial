function copy(object) {
    return JSON.parse(JSON.stringify(object));
}

const Mutation = {
    insertPeople(parent, args, { db, pubsub }, info) {
        let inserted = [];
        let deleted = [];
        try {
            args.data.forEach(async (person) => {
                // const index = db.people.findIndex((db_person => db_person.ssn === person.ssn));
                // if (index >= 0) {
                //     deleted.push(copy(db.people[index]))
                //     db.people.splice(index, 1);
                // }
                // db.people.push({...person});

                const result = await db.People.findOne({ssn:person.ssn})
                if(!result){
                    const new_people = await new db.People({...person});
                    new_people.save();
                    inserted.push(new_people);
                }else{
                    const update_people = await db.People.updateOne({ssn:person.ssn},{...person});
                    inserted.push(result);
                    deleted.push(update_people);
                }
            })

            pubsub.publish('PEOPLE', {
                people: {
                    inserted: inserted,
                    deleted: deleted
                }
            })
            return true;
        } catch (err){
            console.log(err)
            return false;
        }

    },
}

export default Mutation;
