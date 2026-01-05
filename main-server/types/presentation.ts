export type CheckpointOption = {
  id: string; // VD: "A", "B", "C"
  text: string; // VD: "Product Owner"
};

export type CheckpointData = {
  id: string;
  presentationId: string;
  pageNumber: number;
  question: string;
  options: CheckpointOption[];
  correctAnswer: string[]; // Array containing the correct IDs (e.g., ["A"])
  timeLimit: number;
};

export type Presentation = {
  id: string;
  name: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  checkpoints?: CheckpointData[]; // Load checkpoints when entering Editor
  _count?: {
    sessions: number;
    checkpoints: number;
  };
};

export type CreatePresentationRequest = {
  userId: string;
  name: string;
  fileUrl: string;
};

// Data type sent to the API when creating/editing a question
export type SaveCheckpointRequest = {
  userId: string; // To check ownership
  pageNumber: number;
  question: string;
  options: CheckpointOption[];
  correctAnswer: string[];
  timeLimit: number;
};
