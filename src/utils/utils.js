import { createFFmpegCore } from '@ffmpeg/ffmpeg';

export const readFromBlobOrFile = (blob) => (
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = ({ target: { error: { code } } }) => {
        reject(Error(`File could not be read! Code=${code}`));
      };
      fileReader.readAsArrayBuffer(blob);
    })
  );
  
  const parseArgs = (Core, args) => {
    const argsPtr = Core._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);
    args.forEach((s, idx) => {
      const buf = Core._malloc(s.length + 1);
      Core.writeAsciiToMemory(s, buf);
      Core.setValue(argsPtr + (Uint32Array.BYTES_PER_ELEMENT * idx), buf, 'i32');
    });
    return [args.length, argsPtr];
  };
  
  const ffmpeg = (Core, args) => {
    Core.ccall(
      'proxy_main',
      'number',
      ['number', 'number'],
      parseArgs(Core, ['ffmpeg', '-nostdin', ...args]),
    );
  };
  
  export const runFFmpeg = async (ifilename, data, args, ofilename, extraFiles = []) => {
    let resolve = null;
    let file = null;
    const Core = await createFFmpegCore({
      printErr: (m) => {
        console.log(m);
      },
      print: (m) => {
        console.log(m);
        if (m.startsWith('FFMPEG_END')) {
          resolve();
        }
      },
    });
    extraFiles.forEach(({ name, data: d }) => {
      Core.FS.writeFile(name, d);
    });
    Core.FS.writeFile(ifilename, data);
    ffmpeg(Core, args);
    await new Promise((_resolve) => { resolve = _resolve });
    if (typeof ofilename !== 'undefined') {
      file = Core.FS.readFile(ofilename);
      Core.FS.unlink(ofilename);
    }
    return { Core, file };
  };
  
 export const b64ToUint8Array = (str) => (Uint8Array.from(atob(str), c => c.charCodeAt(0)));

  // module.exports = {
  //   runFFmpeg,
  //   readFromBlobOrFile,
  //   b64ToUint8Array,
  // }