export interface User {
  id: number;
  email: string;
  name: string;
  role: 'parent' | 'teacher' | 'professional';
  children?: Child[];
  preferences: UserPreferences;
  createdAt: Date;
}

export interface Child {
  id: number;
  name: string;
  age: number;
  diagnosisDate?: Date;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences: ChildPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'high-contrast';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'default' | 'opendyslexic';
  notifications: boolean;
}

export interface ChildPreferences {
  fontFamily: 'default' | 'opendyslexic';
  fontSize: 'small' | 'medium' | 'large';
  contrast: 'normal' | 'high';
  soundEnabled: boolean;
  animationsEnabled: boolean;
}
