export interface Status {
    ok: boolean;
    errMessage: string | null;
};

export interface Section {
    id: string;
    sectionName: string;
    targetBPM: number;
    sectionBpms: Bpm[];
    createdAt?: Date;
};

export interface Bpm {
    id: string;
    bpm: number;
    createdAt?: String;
    status?: Status;
};

export interface AddSections {
    addSections: {
        sections: Section;
        status: Status;
    }
}

export interface UpdateSection {
    updateSection: Status;
}

export interface RemoveSection {
    removeSection: Status;
}

export interface AddBpm {
    addBpm: Bpm;
}

export interface RemoveBpm {
    removeBpm: Status;
}