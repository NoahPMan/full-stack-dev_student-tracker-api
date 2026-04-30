import { prisma } from "../db/prisma";

type CreateCourseInput = {
    code: string;
    name: string;
    credits?: number | null;
    instructor?: string | null;
    semester?: string | null;
    description?: string | null;
};

type UpdateCourseInput = Partial<CreateCourseInput>;

async function assertOwnedCourse(userId: string, courseId: string) {
    const course = await prisma.course.findFirst({
        where: { id: courseId, userId },
        select: { id: true },
    });

    if (!course) {
        const err = new Error("Course not found");
        (err as any).status = 404;
        throw err;
    }
}

export async function listCourses(userId: string) {
    return prisma.course.findMany({
        where: { userId },
        orderBy: [{ createdAt: "asc" }],
    });
}

export async function searchCourses(userId: string, q: string) {
    const query = q.trim();
    if (!query) return [];

    return prisma.course.findMany({
        where: {
            userId,
            OR: [
                { code: { contains: query, mode: "insensitive" } },
                { name: { contains: query, mode: "insensitive" } },
            ],
        },
        orderBy: [{ createdAt: "asc" }],
    });
}

export async function createCourse(userId: string, input: CreateCourseInput) {
    const code = input.code?.trim();
    const name = input.name?.trim();

    if (!code || !name) {
        const err = new Error("code and name are required");
        (err as any).status = 400;
        throw err;
    }

    return prisma.course.create({
        data: {
            userId,
            code,
            name,
            credits: input.credits ?? null,
            instructor: input.instructor ?? null,
            semester: input.semester ?? null,
            description: input.description ?? null,
        },
    });
}

export async function updateCourse(userId: string, courseId: string, patch: UpdateCourseInput) {
    await assertOwnedCourse(userId, courseId);

    return prisma.course.update({
        where: { id: courseId },
        data: {
            code: patch.code !== undefined ? patch.code.trim() : undefined,
            name: patch.name !== undefined ? patch.name.trim() : undefined,
            credits: patch.credits !== undefined ? patch.credits : undefined,
            instructor: patch.instructor !== undefined ? patch.instructor : undefined,
            semester: patch.semester !== undefined ? patch.semester : undefined,
            description: patch.description !== undefined ? patch.description : undefined,
        },
    });
}

export async function getSummary(userId: string, courseId: string) {
    await assertOwnedCourse(userId, courseId);

    const [assignmentsCount, notesCount] = await Promise.all([
        prisma.homework.count({ where: { userId, courseId } }),
        prisma.note.count({ where: { userId, courseId } }),
    ]);

    return { assignmentsCount, notesCount };
}

export async function deleteCourseUnassign(userId: string, courseId: string) {
    await assertOwnedCourse(userId, courseId);

    await prisma.$transaction(async (tx) => {
        // ✅ unassign content
        await tx.homework.updateMany({
            where: { userId, courseId },
            data: { courseId: null },
        });

        await tx.note.updateMany({
            where: { userId, courseId },
            data: { courseId: null },
        });

        // delete course
        await tx.course.delete({ where: { id: courseId } });
    });

    return { success: true };
}
