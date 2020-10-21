export interface BoggleGameModeInterface {
	dice: string[][];
	calculateScore(list: string[]): number;
}

export default abstract class BoggleGameMode
	implements BoggleGameModeInterface {
	abstract dice: string[][];
	calculateScore = (list: string[]) => {
		var score = 0;
		list.forEach((item) => {
			if (item.includes("=")) {
				item = item.replace(/[^0-9]/gm, "");
			}
			if (item.length == 3 || item.length == 4) score += 1;
			if (item.length == 5) score += 2;
			if (item.length == 6) score += 3;
			if (item.length == 7) score += 5;
			if (item.length > 7) score += 11;
		});
		return score;
	};
}
