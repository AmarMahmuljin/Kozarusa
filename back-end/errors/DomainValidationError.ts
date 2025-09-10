export class DomainValidationError extends Error {
    issues: string[];
    constructor(issues: string[]) {
        super(issues.join('; '));
        this.issues = issues;
    }
}