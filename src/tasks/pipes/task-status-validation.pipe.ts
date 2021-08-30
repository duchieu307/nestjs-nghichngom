import { BadGatewayException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from '../../const/task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform{
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]
    transform(value){
        value = value.toUpperCase();

        if(this.isStatusValid(value)){
            throw new BadGatewayException(`${value} is an invalid status` );
        }

        return value;
    }

    private isStatusValid(status: any){
        let index = this.allowedStatuses.indexOf(status);
        console.log(index);
        return index === -1 ;
    }
}