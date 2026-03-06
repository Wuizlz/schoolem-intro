if (typeof globalThis.window === "undefined") {
  globalThis.window = {
    location: { origin: "http://localhost" },
  };
}

if (typeof globalThis.Blob === "undefined") {
  globalThis.Blob = class Blob {};
}

if (typeof globalThis.File === "undefined") {
  globalThis.File = class File extends Blob {
    constructor(chunks, name, options = {}) {
      super(chunks, options);
      this.name = name;
      this.lastModified = options.lastModified ?? Date.now();
      this.type = options.type ?? "";
    }
  };
}
