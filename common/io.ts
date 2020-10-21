const stdin = {
	async *[Symbol.asyncIterator]() {
		while (true) {
			const buf = new Uint8Array(1024);
			const n = <number>await Deno.stdin.read(buf);
			const answer = new TextDecoder().decode(buf.subarray(0, n)).trim();
			yield answer;
		}
	},
};

export { stdin };
