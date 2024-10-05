
// Wil be the same structure as powershell script
// This will be used to create json object for fastlane pilot upload
interface AppStoreFastlaneInfo {
    key_id: string;
    issuer_id: string;
    key: string;
    duration: number;
    in_house: boolean;
}