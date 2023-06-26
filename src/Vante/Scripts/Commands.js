const fs = require('fs');
module.exports.run = async (client) => {
    const content = [`# Commands  \nHere's the list of Vante Bots commands. This one contains more than **${client.commands.size + client.contextcommands.size} commands** in **${categories.length} categories**!  \n\n#### Contents of the table  \n**Name**: The name of the command  \n**Description**: A brief explanation of the purpose of the command  \n**Usage**: The arguments/options that the command takes in parameters  \n**Cooldown**: The time that must elapse between each command so that it can be executed again by the user\n\n`];

        try {
            const categories = (client.commands.map(c => '## ' + c.Category).filter((v, i, a) => a.indexOf(v) === i));
            categories
			.sort((a, b) => a.Category - b.Category)
			.forEach(Category => {
				const co = client.commands
					.filter(c => c.Category === Category.slice(3))
					.sort((a, b) => a.Name - b.Name)
					.map(c => `| ${c.Name}	|	${c.Description}	|	\`${c.Usage}\`	|`).join('\n');
				content.push(Category, '|	Command	| description	| Usage', '|---------------|--------------------|--------------|', co, '\n');
			});
			
            fs.writeFileSync(`${__dirname}/../Base/Assets/Commands.md`, content.join('\n'));
		    return 'complete';
        } catch (e) {
            return e;
        };
};