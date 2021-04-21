/**
 * Group presence tab
 * 
 * This is a Forez feature
 * 
 * @author Pierre Hubert
 */

class GroupPresencePage {
    /**
     * Show the page
     * 
     * @param {AdvancedGroupInfo} group 
     * @param {HTMLElement} target 
     */
    static async Show(group, target) {
        const presence = await ForezPresenceHelper.GetList(group.id);
        const users = await getUsers([...new Set(presence.map(e => e.userID))]);

        console.error(presence, users)
    }
}