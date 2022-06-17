// Expose zopfli.js API using pako interface
// so webpack alias can do its dirty work

import { Zopfli } from 'zopfli.js';

class PakoLikeDeflate {
	constructor() {
		console.log('Using zopfli instead of pako');
		this._chunks = [];
	}
	push(chunk, final=false) {
		if (chunk.length > 0) {
			// zopfli.js doesn't work with streaming
			// we have to collect them until the final flag is set
			this._chunks.push(chunk);
		}
		if (!final) {
			return;
		}
		const merged = mergeChunks(this._chunks.splice(0));
		const zopfli = new Zopfli.RawDeflate(
			merged,
			{ iterations: 15 }
		);
		const compressed = zopfli.compress();
		if (this.onData) {
			this.onData(compressed);
		}
		return compressed;
	}
}

/**
 * @param {ReadonlyArray<Uint8Array>} uias 
 * @returns {Uint8Array}
 */
function mergeChunks(chunks) {
	// How much memory to allocate
	let totalLength = 0;
	for (const chunk of chunks) {
		totalLength += chunk.byteLength;
	}
	const rv = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		rv.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return rv;
}


export { PakoLikeDeflate as Deflate };
