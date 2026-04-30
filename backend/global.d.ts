/// <reference types="@clerk/express/env" />

import "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export { };
