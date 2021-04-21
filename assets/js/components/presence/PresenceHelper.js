/**
 * Forez Presence Helper
 * 
 * @author Pierre Hubert
 */

class Presence {
    constructor(userID, year, month, day) {
        this.userID = userID;
        this.year = year;
        this.month = month;
        this.day = day;
    }
}


class ForezPresenceHelper {
    /**
     * Load the list of presence
     * 
     * @param {number} groupID Target group ID
     * @returns {Promise<Presence[]>}
     */
    static async GetList(groupID) {
        const list = await ws("forez_presence/list", {group: groupID});

        return list.map(el => {
            const infos = el.split(",").map(e => Number(e));
            return new Presence(...infos)
        });
    }

    /**
     * Add a day of presence
     * 
     * @param {number} groupID 
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     */
    static async AddDay(groupID, year, month, day) {
        await ws("forez_presence/add_day", {
            group: groupID,
            year: year,
            month: month,
            day: day
        })
    }

    /**
     * Remove a day of presence
     * 
     * @param {number} groupID 
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     */
    static async DelDay(groupID, year, month, day) {
        await ws("forez_presence/add_day", {
            group: groupID,
            year: year,
            month: month,
            day: day
        })
    }
}